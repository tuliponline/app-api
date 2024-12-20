import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Types } from 'mongoose';
import { CreateTemplateDto } from './dto/create-template.dto';
import { Template, TemplateDocument } from './schemas/template.schema';
import { SuccessResponse } from 'src/responses/success.response';
import { SuccessResponseWithMeta } from 'src/responses/success.response.withmeta';
import { Meta } from 'src/responses/base.response';
import { UpdateTemplateDto } from './dto/update-template.dto';
import stringGenerator from '@nakarmi23/random-string-generator';
import { UserRole } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { parseFilters } from '../shared/utils/filter-parser.util';
import { exit } from 'process';
import { TemplateDomainService } from 'src/template-domain/template-domain.service';

@Injectable()
export class TemplateService {
  constructor(
    private readonly userService: UserService,
    @InjectModel(Template.name) private templateModel: Model<TemplateDocument>,
    @Inject(forwardRef(() => TemplateDomainService))
    private readonly templateDomainService: TemplateDomainService,
  ) { }
  async create(
    createTemplateDto: CreateTemplateDto,
    userId: string,
  ): Promise<SuccessResponse> {
    const userData = await this.userService.findByUserId(userId);
    const userRole = userData.userRole ?? UserRole.USER;

    const app = stringGenerator(10, { lowercase: false, symbol: false });
    const newTemplate = new this.templateModel({
      ...createTemplateDto,
      userId,
      app,
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
    const templates = await this.templateModel.find(query).skip(skip).limit(limit);
    const data = await this.enrichWithTemplateDomain(templates);

    const meta: Meta = {
      total,
      page,
      limit,
      totalPages,
    };
    return new SuccessResponseWithMeta(data, 'success', meta);
  }

  async findAllAdmin(
    page: number,
    limit: number,
  ): Promise<SuccessResponseWithMeta> {
    try {
      const skip = (page - 1) * limit;
      const query = { createdBy: UserRole.ADMIN, email: "admin@gmail.com" };
      const total = await this.templateModel.countDocuments(query);
      const totalPages = Math.ceil(total / limit);
      const templates = await this.templateModel.find(query).skip(skip).limit(limit);
      const data = await this.enrichWithTemplateDomain(templates);
      const meta: Meta = {
        total,
        page,
        limit,
        totalPages,
      };
      return new SuccessResponseWithMeta(data, 'success', meta);
    } catch (e) {
      console.log(e);
    }
  }

  async findOne(userId: string, id: string, filters?: string): Promise<SuccessResponse> {
    try {
      const query: any = { _id: id };

      const filter = filters ? parseFilters(filters) : {};
      Object.entries(filter).forEach(([key, value]) => {
        switch (key) {
          case 'pages':
            break;
          default:
            query[key] = value;
        }
      });

      // const template = await this.templateModel.findOne({ _id: id, userId });
      const template = await this.templateModel.findOne(query);
      if (!template) {
        throw new NotFoundException('Template not found');
      }

      if (filter.pages) {
        const pagesFilter = Array.isArray(filter.pages) ? filter.pages : filter.pages.split('|');
        template.components = template.components.filter((component) =>
          component.pages && component.pages.some((page: string) => pagesFilter.includes(page))
        );
      }

      const enrichedData = await this.enrichWithTemplateDomain([template]);

      return new SuccessResponse(enrichedData[0], 'success');
    } catch (e) {
      throw e; // Re-throw the error for proper handling
    }
  }

  async findByApp(app: string, filters?: string): Promise<SuccessResponse> {
    try {
      const query: any = { app };

      const filter = filters ? parseFilters(filters) : {};
      Object.entries(filter).forEach(([key, value]) => {
        switch (key) {
          case 'pages':
            break;
          default:
            query[key] = value;
        }
      });

      const template = await this.templateModel.findOne(query);
      if (!template) {
        throw new NotFoundException('Template not found');
      }

      if (filter.pages) {
        const pagesFilter = Array.isArray(filter.pages) ? filter.pages : filter.pages.split('|');
        template.components = template.components.filter((component) =>
          component.pages && component.pages.some((page: string) => pagesFilter.includes(page))
        );
      }

      const enrichedData = await this.enrichWithTemplateDomain([template]);

      return new SuccessResponse(enrichedData[0], 'success');
    } catch (e) {
      throw e; // Re-throw the error for proper handling
    }
  }

  async findByDomain(domain: string): Promise<SuccessResponse> {
    try {
      const template = await this.templateModel.findOne({ domain });
      if (!template) {
        throw new NotFoundException('Template not found');
      }

      const enrichedData = await this.enrichWithTemplateDomain([template]);

      return new SuccessResponse(enrichedData[0], 'success');
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

  async enrichWithTemplateDomain(templates: any[]): Promise<any[]> {
    const templateIds = templates
      .map((template) => template?._id?.toString()) // Safely access `_id` and convert to string
      .filter((id) => id); // Remove undefined or null values

    const filters = `templateId:${templateIds.join('|')}`;

    const templateDomainsResponse = await this.templateDomainService.findWithPagination(1, 999, filters);

    const domainMap = new Map<string, any>(
      templateDomainsResponse.data.map((domain: any) => [
        domain.template._id.toString(),
        domain,
      ])
    );

    domainMap.forEach((value, key) => {
      if (value.template) {
        value.templateId = value.template.templateId; // Assign `templateId`
        delete value.template; // Remove `template`
      }
    });

    return templates.map((template) => ({
      ...template.toObject ? template.toObject() : template, // Handle plain objects or Mongoose documents
      templateDomain: template?._id ? domainMap.get(template._id.toString()) : null,
    }));
  }
}  
