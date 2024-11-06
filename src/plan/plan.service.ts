import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Plan, PlanDocument } from './schemas/plas.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Model } from 'mongoose';
import { SuccessResponse } from 'src/responses/success.response';
import { SuccessResponseWithMeta } from 'src/responses/success.response.withmeta';
import { Meta } from 'src/responses/base.response';
import { parseFilters } from '../shared/utils/filter-parser.util';

@Injectable()
export class PlanService {
  constructor(@InjectModel(Plan.name) private planModel: Model<PlanDocument>) {}
  async create(createPlanDto: CreatePlanDto): Promise<SuccessResponse> {
    try {
      const plan = await new this.planModel(createPlanDto).save();
      return new SuccessResponse(plan);
    } catch (e) {
      throw new ConflictException(e.message);
    }
  }

  async findAll(page: number, limit: number, filters?: string): Promise<SuccessResponseWithMeta> {
    const filter = filters ? parseFilters(filters) : {};

    Object.entries(filter).forEach(([key, value]) => {
      switch (key) {
        case '_id':
          filter[key] = { $in: value.split('|').map((item: string) => new Types.ObjectId(item)) };
          break;
        case 'isRecommended':
        case 'isActive':
          filter[key] = value === 'true' ? true : false;
        default:
          filter[key] = value;
      }
    });

    const skip = (page - 1) * limit;
    const total = await this.planModel.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    const data = await this.planModel.find(filter).skip(skip).limit(limit);
    const meta: Meta = {
      total,
      page,
      limit,
      totalPages,
    };
    return new SuccessResponseWithMeta(data, 'success', meta);
  }

  async findOne(id: string): Promise<SuccessResponse> {
    try {
      const plan = await this.planModel.findById(id);

      if (!plan) {
        throw new NotFoundException('id not found');
      }

      const spacialPrice = plan.price - plan.discount;
      const vat = Math.round(spacialPrice * 0.07);
      const total = spacialPrice + vat;
      const response = {
        ...plan.toObject(), // Convert Mongoose document to plain object
        spacialPrice: spacialPrice,
        vat: vat,
        total: total,
      };
      return new SuccessResponse(response);
    } catch (e) {
      throw new NotFoundException('id not found');
    }
  }

  async update(
    id: string,
    updatePlanDto: UpdatePlanDto,
  ): Promise<SuccessResponse> {
    try {
      const plan = await this.planModel.findByIdAndUpdate(id, updatePlanDto, {
        new: true,
      });
      return new SuccessResponse(plan);
    } catch (e) {
      throw new NotFoundException('id not found');
    }
  }

  async remove(id: string): Promise<SuccessResponse> {
    try {
      await this.planModel.findByIdAndDelete(id);
      return new SuccessResponse(null);
    } catch (e) {
      throw new NotFoundException('id not found');
    }
  }
}
