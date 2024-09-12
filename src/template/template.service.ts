import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTemplateDto } from './dto/create-template.dto';
import { Template, TemplateDocument } from './schemas/template.schema';
import { SuccessResponse } from 'src/responses/success.response';
import { SuccessResponseWithMeta } from 'src/responses/success.response.withmeta';
import { Meta } from 'src/responses/base.response';
import { UpdateTemplateDto } from './dto/update-template.dto';
import stringGenerator from '@nakarmi23/random-string-generator';
import { UserRole } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TemplateService {
  constructor(
    private readonly userService: UserService,
    @InjectModel(Template.name) private templateModel: Model<TemplateDocument>,
  ) {}
  async create(
    createTemplateDto: CreateTemplateDto,
    userId: string,
  ): Promise<SuccessResponse> {
    const userData = await this.userService.findByUserId(userId);
    const userRole = userData.userRole ?? UserRole.USER;

    const slug = stringGenerator(10, { lowercase: false, symbol: false });
    const newTemplate = new this.templateModel({
      ...createTemplateDto,
      userId,
      slug,
      createdBy: userRole,
    });
    await newTemplate.save();
    return new SuccessResponse('null', 'Template created successfully');
  }

  async findAll(
    page: number,
    limit: number,
    userId: string,
  ): Promise<SuccessResponseWithMeta> {
    const skip = (page - 1) * limit;
    const query = userId ? { userId } : {};
    const total = await this.templateModel.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    const data = await this.templateModel.find(query).skip(skip).limit(limit);
    const meta: Meta = {
      total,
      page,
      limit,
      totalPages,
    };
    return new SuccessResponseWithMeta(data, 'success', meta);
  }

  async findOne(userId: string, id: string): Promise<SuccessResponse> {
    try {
      const template = await this.templateModel.findOne({ _id: id, userId });
      if (!template) {
        throw new NotFoundException('Template not found');
      }
      return new SuccessResponse(template, 'success');
    } catch (e) {
      throw e; // Re-throw the error for proper handling
    }
  }

  async update(
    userId: string,
    id: string,
    updateTemplateDto: UpdateTemplateDto,
  ): Promise<SuccessResponse> {
    try {
      const template = await this.templateModel.findOneAndUpdate(
        { _id: id, userId },
        updateTemplateDto,
        { new: true },
      );
      if (!template) {
        throw new NotFoundException('Template not found');
      }
      return new SuccessResponse(template, 'success');
    } catch (e) {
      throw e; // Re-throw the error for proper handling
    }
  }

  async remove(userId: string, id: string): Promise<SuccessResponse> {
    try {
      const template = await this.templateModel.findOneAndDelete({
        _id: id,
        userId,
      });
      if (!template) {
        throw new NotFoundException('Template not found');
      }
      return new SuccessResponse(null, 'success');
    } catch (e) {
      throw e; // Re-throw the error for proper handling
    }
  }
}