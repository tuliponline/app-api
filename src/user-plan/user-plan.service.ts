import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserPlanDto } from './dto/create-user-plan.dto';
// import { UpdateUserPlanDto } from './dto/update-user-plan.dto';
import { UserPlan, UserPlanDocument } from './schemas/user-plan.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlanService } from 'src/plan/plan.service';

@Injectable()
export class UserPlanService {
  constructor(
    private planService: PlanService,
    @InjectModel(UserPlan.name) private userPlanModel: Model<UserPlanDocument>,
  ) {}
  async create(userId: string, planId: string): Promise<UserPlan> {
    const plan = await this.planService.findOne('66ebde11f7a7f3aa72cd5c7b');
    if (!plan) {
      throw new NotFoundException('planId not found');
    }
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 360);

    const createUserPlanDto = new CreateUserPlanDto();
    createUserPlanDto.orderId = planId;
    createUserPlanDto.userId = userId;
    createUserPlanDto.name = plan.data.name;
    createUserPlanDto.price = plan.data.price;
    createUserPlanDto.storage = plan.data.storage;
    createUserPlanDto.pages = plan.data.pages;
    createUserPlanDto.salePage = plan.data.salePage;
    createUserPlanDto.duration = plan.data.duration;
    createUserPlanDto.startDate = new Date();
    createUserPlanDto.endDate = endDate;

    try {
      return await new this.userPlanModel(createUserPlanDto).save();
    } catch (e) {
      throw new Error(e.message);
    }
  }
  test() {
    return 'test';
  }
}
