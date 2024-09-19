import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Plan, PlanDocument } from './schemas/plas.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SuccessResponse } from 'src/responses/success.response';
import { SuccessResponseWithMeta } from 'src/responses/success.response.withmeta';
import { Meta } from 'src/responses/base.response';

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

  async findAll(page: number, limit: number): Promise<SuccessResponseWithMeta> {
    const skip = (page - 1) * limit;
    const total = await this.planModel.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const data = await this.planModel.find().skip(skip).limit(limit);
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
      return new SuccessResponse(plan);
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
