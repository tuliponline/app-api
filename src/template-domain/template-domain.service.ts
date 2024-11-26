import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Types } from 'mongoose';
import { CreateTemplateDomainDto } from './dto/create-template-domain.dto';
import { DomainStatus, TemplateDomain, TemplateDomainDocument } from './schemas/template-domain.schema';
import { SuccessResponse } from 'src/responses/success.response';
import { SuccessResponseWithMeta } from 'src/responses/success.response.withmeta';
import { ResponseTemplateDomainDto } from './dto/response-template-domain.dto';
import { Meta } from 'src/responses/base.response';
import { UpdateTemplateDomainDto } from './dto/update-template-domain.dto';
import { TemplateService } from 'src/template/template.service';
import { parseFilters } from '../shared/utils/filter-parser.util';
import { exit } from 'process';
import { TemplateDomainConstants } from './constants/conts';
import { response } from 'express';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TemplateDomainService {
  constructor(
    @Inject(forwardRef(() => TemplateService))
    private readonly TemplateService: TemplateService,
    @InjectModel(TemplateDomain.name) private TemplateDomain: Model<TemplateDomainDocument>,
  ) { }
  async create(
    CreateTemplateDomainDto: CreateTemplateDomainDto
  ): Promise<SuccessResponse> {
    const templateData = await this.TemplateService.findByApp(CreateTemplateDomainDto.templateApp);
    if (!templateData) {
      throw new NotFoundException(TemplateDomainConstants.NOT_FOUND);
    }

    try {
      const newTemplateDomain = new this.TemplateDomain({
        ...CreateTemplateDomainDto,
        templateId: templateData.data._id,
        Status: DomainStatus.PENDING
      });
      await newTemplateDomain.save();

      return new SuccessResponse(null, TemplateDomainConstants.CREATE_SUCCESS);
    } catch (e) {
      throw e;
    }
  }

  async findWithPagination(
    page: number,
    limit: number,
    filters?: string
  ): Promise<SuccessResponseWithMeta> {
    const query: any = {};
    const filter = filters ? parseFilters(filters) : {};
    Object.entries(filter).forEach(([key, value]) => {
      switch (key) {
        case 'id':
          query['_id'] = { $in: value.split('|').map((item: string) => Types.ObjectId.createFromHexString(item)) };
          break;
        case 'updateBy':
          query[key] = Types.ObjectId.createFromHexString(value)
          break;
        case 'templateId':
          query[key] = { $in: value.split('|').map((item: string) => Types.ObjectId.createFromHexString(item)) };
          break;
        case 'search':
          query['domainName'] = { $regex: value, $options: 'i' };
          break;
        default:
          query[key] = value;
      }
    });

    const skip = (page - 1) * limit;
    const total = await this.TemplateDomain.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const data = await this.TemplateDomain.find(query).populate('templateId', 'pageFor pageType templateId userId name app image pages status createdBy createdAt updatedAt')
      .skip(skip)
      .limit(limit);
    const response = plainToInstance(ResponseTemplateDomainDto, data, { 
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });

    const meta: Meta = {
      total,
      page,
      limit,
      totalPages,
    };
    return new SuccessResponseWithMeta(response, 'success', meta);
  }

  async findOne(id: string): Promise<SuccessResponse> {
    try {
      const templateDomain = await this.TemplateDomain.findOne({ _id: id });
      if (!templateDomain) {
        throw new NotFoundException(TemplateDomainConstants.NOT_FOUND);
      }

      return new SuccessResponse(templateDomain, 'success');
    } catch (e) {
      throw e; // Re-throw the error for proper handling
    }
  }

  async update(
    userId: string,
    id: string,
    UpdateTemplateDomainDto: UpdateTemplateDomainDto,
  ): Promise<SuccessResponse> {
    try {
      console.log(id)
      const templateDomain = await this.TemplateDomain.findOneAndUpdate(
        { _id: id },
        {
          ...UpdateTemplateDomainDto,
          updateBy: Types.ObjectId.createFromHexString(userId),
        },
        { new: true },
      );
      if (!templateDomain) {
        throw new NotFoundException(TemplateDomainConstants.NOT_FOUND);
      }
      return new SuccessResponse(templateDomain, 'success');
    } catch (e) {
      throw e; // Re-throw the error for proper handling
    }
  }

  async remove(id: string): Promise<SuccessResponse> {
    try {
      const templateDomain = await this.TemplateDomain.findOneAndDelete({
        _id: id,
      });
      if (!templateDomain) {
        throw new NotFoundException(TemplateDomainConstants.NOT_FOUND);
      }
      return new SuccessResponse(null, 'success');
    } catch (e) {
      throw e; // Re-throw the error for proper handling
    }
  }
}
