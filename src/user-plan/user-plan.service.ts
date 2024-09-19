import { Injectable } from '@nestjs/common';
import { CreateUserPlanDto } from './dto/create-user-plan.dto';
// import { UpdateUserPlanDto } from './dto/update-user-plan.dto';
import { UserPlan, UserPlanDocument } from './schemas/user-plan.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserPlanService {
  constructor(
    @InjectModel(UserPlan.name) private userPlanModel: Model<UserPlanDocument>,
  ) {}
  async create(userId: string, planId: string): Promise<UserPlan> {
    const createUserPlanDto = new CreateUserPlanDto();
    createUserPlanDto.orderId = planId;
    createUserPlanDto.userId = userId;
    createUserPlanDto.name = '1';
    createUserPlanDto.price = 1;
    createUserPlanDto.collaborators = 1;
    createUserPlanDto.storage = 1;
    createUserPlanDto.pages = 1;
    createUserPlanDto.free_domains = 1;
    createUserPlanDto.marketing_suite = '1';
    createUserPlanDto.site_analytics = '1';
    createUserPlanDto.ecommerce = '1';
    createUserPlanDto.startDate = new Date();
    createUserPlanDto.endDate = new Date();

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
