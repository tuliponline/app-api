import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import * as AWS from 'aws-sdk';
import {
  UploadImage,
  UploadImageDocument,
} from 'src/upload-image/schemas/upload-image.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SuccessResponse } from 'src/responses/success.response';
import { SuccessResponseWithMeta } from 'src/responses/success.response.withmeta';
import { Meta } from 'src/responses/base.response';

@Injectable()
export class UploadImageService {
  private s3: AWS.S3;
  constructor(
    @InjectModel(UploadImage.name)
    private uploadImageModel: Model<UploadImageDocument>,
  ) {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.DO_SPACES_ACCESS_KEY_ID,
      secretAccessKey: process.env.DO_SPACES_SECRET_ACCESS_KEY,
      endpoint: process.env.DO_SPACES_ENDPOINT,
      region: `sgp1`,
    });
  }

  async uploadFile(userId: string, fileName: string, buffer: Buffer) {
    const params = {
      Bucket: 'we11-storage',
      Key: `funnel/${userId}/${fileName}`,
      Body: buffer,
      ACL: 'public-read',
    };
    const { Location } = await this.s3.upload(params).promise();
    if (!Location) {
      throw new BadRequestException('Failed to upload image');
    }
    const imageDb = await this.addImageToDb(
      userId,
      fileName,
      Location,
      buffer.length,
    );
    if (!imageDb) {
      throw new BadRequestException('Failed to upload image to database');
    }
    return imageDb;
  }

  async deleteImage(userId: string, id: string) {
    const image = await this.uploadImageModel.findOne({ _id: id, userId });
    if (!image) {
      throw new NotFoundException('Image not found');
    }
    const imageName = image.fileName;

    await this.s3
      .deleteObject({
        Bucket: 'we11-storage',
        Key: `funnel/${userId}/${imageName}`,
      })
      .promise();
    await this.uploadImageModel.deleteOne({ _id: id });
    return new SuccessResponse('Image deleted successfully');
  }

  async addImageToDb(
    userId: string,
    fileName: string,
    imageUrl: string,
    size: number,
  ) {
    const existingImage = await this.uploadImageModel.findOne({ imageUrl });
    if (existingImage) {
      existingImage.size = size;
      await existingImage.save();
      return existingImage;
    } else {
      const newUploadImage = new this.uploadImageModel({
        userId,
        imageUrl,
        size,
        fileName,
      });
      const data = await newUploadImage.save();
      return data;
    }
  }

  async findAll(
    page: number,
    limit: number,
    userId: string,
  ): Promise<SuccessResponseWithMeta> {
    const skip = (page - 1) * limit;
    const query = userId ? { userId } : {};
    const total = await this.uploadImageModel.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const data = await this.uploadImageModel
      .find(query)
      .skip(skip)
      .limit(limit);
    const meta: Meta = {
      total,
      page,
      limit,
      totalPages,
    };
    return new SuccessResponseWithMeta(data, 'success', meta);
  }

  async findOne(userId: string, id: string) {
    const image = await this.uploadImageModel.findOne({ _id: id, userId });
    if (!image) {
      throw new NotFoundException('Image not found');
    }
    return image;
  }

  async sumImageSizes(userId: string): Promise<number> {
    const images = await this.uploadImageModel.find({ userId });
    const totalSize = images.reduce((sum, image) => sum + image.size, 0);
    return totalSize;
  }
}
