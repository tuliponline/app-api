import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import * as AWS from 'aws-sdk';
import {
  UploadImage,
  UploadImageDocument,
} from 'src/upload-image/schemas/upload-image.schema';
import {
  UploadImageScreenshot,
  UploadImageScreenshotDocument,
} from 'src/upload-image/schemas/upload-image-screenshot.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SuccessResponse } from 'src/responses/success.response';
import { SuccessResponseWithMeta } from 'src/responses/success.response.withmeta';
import { Meta } from 'src/responses/base.response';
import { UserService } from 'src/user/user.service';
import { UserRole } from 'src/user/schemas/user.schema';

@Injectable()
export class UploadImageService {
  private s3: AWS.S3;
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @InjectModel(UploadImage.name)
    private uploadImageModel: Model<UploadImageDocument>,
    @InjectModel(UploadImageScreenshot.name)
    private uploadImageScreenshotModel: Model<UploadImageScreenshotDocument>,
  ) {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.DO_SPACES_ACCESS_KEY_ID,
      secretAccessKey: process.env.DO_SPACES_SECRET_ACCESS_KEY,
      endpoint: process.env.DO_SPACES_ENDPOINT,
      region: `sgp1`,
    });
  }

  async uploadFile(
    userId: string,
    fileName: string,
    buffer: Buffer,
    screenshot: boolean = false,
  ) {
    const finalFileName = fileName.replace(/\s/g, '').toLowerCase();
    const params = {
      Bucket: 'we11-storage',
      Key: `funnel/${userId}/${finalFileName}`,
      Body: buffer,
      ACL: 'public-read',
    };
    const { Location } = await this.s3.upload(params).promise();
    if (!Location) {
      throw new BadRequestException('Failed to upload image');
    }

    if (screenshot) {
      const imageDb = await this.addImageScreenShotToDb(
        finalFileName,
        Location,
      );
      if (!imageDb) {
        throw new BadRequestException('Failed to upload image to database');
      }
      return imageDb;
    }
    const imageDb = await this.addImageToDb(
      userId,
      finalFileName,
      Location,
      buffer.length,
    );
    if (!imageDb) {
      throw new BadRequestException('Failed to upload image to database');
    }
    return imageDb;
  }

  async deleteImage(userId: string, id: string, screenshot: boolean = false) {
    let image;
    if (screenshot) {
      image = await this.uploadImageScreenshotModel.findById(id);
    } else {
      image = await this.uploadImageModel.findOne({ _id: id, userId });
    }
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
    if (screenshot) {
      await this.uploadImageScreenshotModel.deleteOne({ _id: id });
      return new SuccessResponse('Image deleted successfully');
    }

    await this.uploadImageModel.deleteOne({ _id: id });
    return new SuccessResponse('Image deleted successfully');
  }

  async addImageScreenShotToDb(fileName: string, imageUrl: string) {
    const existingImage = await this.uploadImageScreenshotModel.findOne({
      imageUrl,
    });
    if (existingImage) {
      await existingImage.save();
      return existingImage;
    } else {
      const newUploadImage = new this.uploadImageScreenshotModel({
        imageUrl,
        fileName,
      });
      const data = await newUploadImage.save();
      return data;
    }
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
      const userData = await this.userService.findByUserId(userId);
      const userRole = userData.userRole ?? UserRole.USER;
      const newUploadImage = new this.uploadImageModel({
        userId,
        imageUrl,
        size,
        fileName,
        createdBy: userRole,
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
  async findScreenshotAll(
    page: number,
    limit: number,
  ): Promise<SuccessResponseWithMeta> {
    const skip = (page - 1) * limit;
    const query = {};
    const total = await this.uploadImageScreenshotModel.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const data = await this.uploadImageScreenshotModel
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

  async findAdminImages(
    page: number,
    limit: number,
  ): Promise<SuccessResponseWithMeta> {
    const skip = (page - 1) * limit;
    const query = { createdBy: UserRole.ADMIN };
    const total = await this.uploadImageModel.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const data = await this.uploadImageModel
      .find(query)
      .select('-userId')
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

  async findAdminImage(id: string) {
    const image = await this.uploadImageModel
      .findOne({
        _id: id,
        createdBy: UserRole.ADMIN,
      })
      .select('-userId');
    if (!image) {
      throw new NotFoundException('Image not found');
    }
    return image;
  }
  async findOne(userId: string, id: string, screenshot = false) {
    let image;
    if (screenshot) {
      image = await this.uploadImageScreenshotModel.findById(id);
    } else {
      image = await this.uploadImageModel.findOne({ _id: id, userId });
    }
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

  async uploadFileToS3(localtion: string, fileName: string, buffer: Buffer) {
    const params = {
      Bucket: 'we11-storage',
      Key: localtion,
      Body: buffer,
      ACL: 'public-read',
    };

    console.log(params);

    try {
      const { Location } = await this.s3.upload(params).promise();
      return Location; // URL ของไฟล์ที่อัปโหลดสำเร็จ
    } catch (error) {
      console.error('Upload Error:', error.message);
      throw new BadRequestException('Failed to upload image');
    }
  }

  async deleteFileFromS3(key: string) {
    await this.s3
      .deleteObject({
        Bucket: 'we11-storage',
        Key: key,
      })
      .promise();

    return new SuccessResponse('Image deleted successfully');
  }
}
