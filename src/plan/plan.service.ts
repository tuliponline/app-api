import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Plan, PlanDocument } from './schemas/plas.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response, Meta } from './interfaces/response.interface';

@Injectable()
export class PlanService {
  constructor(@InjectModel(Plan.name) private planModel: Model<PlanDocument>) {}
  async create(createPlanDto: CreatePlanDto): Promise<Plan> {
    const newPlan = new this.planModel(createPlanDto);
    return newPlan.save();
  }

  async findAll(page: number, limit: number): Promise<Response<Plan>> {
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
    return { data, meta };
  }

  findOne(id: string) {
    return this.planModel.findById(id);
  }

  async update(id: string, updatePlanDto: UpdatePlanDto): Promise<Plan> {
    try {
      return this.planModel.findByIdAndUpdate(id, updatePlanDto, { new: true });
    } catch (e) {
      throw new NotFoundException('id not found');
    }
  }

  async remove(id: string) {
    try {
      await this.planModel.findByIdAndDelete(id);
      return { success: true, message: 'deleted successfully' };
    } catch (e) {
      throw new NotFoundException('id not found');
    }
  }
}
