import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { UploadImageService } from 'src/upload-image/upload-image.service';
import { InjectModel } from '@nestjs/mongoose';
import { Bank, BankDocument } from './schemas/banks.schema';
import { Model, Types } from 'mongoose';
import { SuccessResponse } from 'src/responses/success.response';
import { parseFilters } from 'src/shared/utils/filter-parser.util';
import { Meta } from 'src/responses/base.response';
import { SuccessResponseWithMeta } from 'src/responses/success.response.withmeta';
import { BankConstants } from './constants/conts';

@Injectable()
export class BanksService {
  constructor(
    @InjectModel(Bank.name) private bankModel: Model<BankDocument>,
    private readonly uploadImageService: UploadImageService,
  ) { }
  async create(createBankDto: CreateBankDto, file: any) {
    if (file && file.buffer) {
      const finalFileName = file.originalname.replace(/\s/g, '').toLowerCase();
      createBankDto.logo = await this.uploadImageService.uploadFileToS3(
        `banks/${finalFileName}`,
        file.originalname,
        file.buffer,
      );
    } else {
      delete createBankDto.logo;
    }

    const bank = new this.bankModel(createBankDto);
    await bank.save();

    return new SuccessResponse(null, 'Bank created successfully');
  }

  async findAll(page: number, limit: number, filters?: string) {
    const query: any = {};
    const filter = filters ? parseFilters(filters) : {};
    Object.entries(filter).forEach(([key, value]) => {
      switch (key) {
        case 'id':
          query['_id'] = { $in: value.split('|').map((item: string) => Types.ObjectId.createFromHexString(item)) };
          break;
        default:
          query[key] = value;
      }
    });

    const skip = (page - 1) * limit;
    const total = await this.bankModel.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const data = await this.bankModel.find(query).skip(skip).limit(limit);
    const meta: Meta = {
      total,
      page,
      limit,
      totalPages,
    };
    return new SuccessResponseWithMeta(data, 'success', meta);
  }

  async findOne(id: string) {
    try {
      const bank = await this.bankModel.findById(id);
      if (!bank) {
        throw new NotFoundException(BankConstants.NOT_FOUND);
      }
      return new SuccessResponse(bank, 'success');
    }
    catch (e) {
      throw e; // Re-throw the error for proper handling
    }
  }

  async update(id: string, updateBankDto: UpdateBankDto, file: any) {
    if (file && file.buffer) {
      const bankData = await this.bankModel.findById(id);
      if (bankData.logo) {
        const url = new URL(bankData.logo);
        const key = url.pathname.substring(1);
        await this.uploadImageService.deleteFileFromS3(key);
      }

      const finalFileName = file.originalname.replace(/\s/g, '').toLowerCase();
      updateBankDto.logo = await this.uploadImageService.uploadFileToS3(
        `banks/${finalFileName}`,
        file.originalname,
        file.buffer,
      );
    }else {
      delete updateBankDto.logo
    }

    const result = await this.bankModel.findByIdAndUpdate(id, updateBankDto, {
      new: true,
    })

    if (!result) {
      throw new NotFoundException(BankConstants.NOT_FOUND);
    }

    return new SuccessResponse("updated successfully");
  }

  async remove(id: string) {
    try {
      const bank = await this.bankModel.findByIdAndDelete(id);
      if (!bank) {
        throw new NotFoundException(BankConstants.NOT_FOUND);
      }
      return new SuccessResponse(null, 'success');
    } catch (e) {
      throw e; // Re-throw the error for proper handling
    }
  }
}
