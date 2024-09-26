import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
// import { CreateUserPlanDto } from './dto/create-user-plan.dto';
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
  async create(
    userId: string,
    planId: string,
    orderNo: string,
  ): Promise<UserPlan> {
    const plan = await this.planService.findOne(planId);
    if (!plan) {
      throw new NotFoundException('planId not found');
    }
    const existingPlan = await this.userPlanModel.findOne({ userId });
    if (existingPlan) {
      existingPlan.orderNo = orderNo;
      existingPlan.name = plan.data.name;
      existingPlan.price = plan.data.price;
      existingPlan.storage = plan.data.storage;
      existingPlan.pages = plan.data.pages;
      existingPlan.salePage = plan.data.salePage;
      existingPlan.duration = plan.data.duration;
      existingPlan.startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 360);
      existingPlan.endDate = endDate;

      try {
        return await existingPlan.save();
      } catch (e) {
        throw new Error(e.message);
      }
    } else {
      // Create a new UserPlan
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 360);
      const newUserPlan = new this.userPlanModel({
        userId,
        orderNo,
        name: plan.data.name,
        price: plan.data.price,
        storage: plan.data.storage,
        pages: plan.data.pages,
        salePage: plan.data.salePage,
        duration: plan.data.duration,
        startDate: new Date(),
        endDate,
      });

      try {
        return await newUserPlan.save();
      } catch (e) {
        // Handle potential unique constraint violation (e.g., throw specific error)
        if (e.code === 11000) {
          // Assuming MongoDB error code for duplicate key
          throw new ConflictException('User already has an active plan');
        } else {
          throw new Error(e.message);
        }
      }
    }
  }
  async checkHasPlan(userId: string): Promise<boolean> {
    const userPlan = await this.userPlanModel.findOne({ userId });
    if (!userPlan) {
      return false;
    }

    const currentDate = new Date();
    const endDate = new Date(userPlan.endDate);
    if (currentDate >= endDate) {
      return false;
    } else {
      return true;
    }
  }
  async findByUserId(userId: string): Promise<UserPlan> {
    const userPlan = await this.userPlanModel.findOne({ userId });

    if (!userPlan) {
      return null;
    }

    const currentDate = new Date();
    const endDate = new Date(userPlan.endDate);

    if (currentDate >= endDate) {
      return {
        ...userPlan.toObject(),
        hasExpired: true,
      };
    } else {
      // Current time is before end date
      return {
        ...userPlan.toObject(),
        hasExpired: false,
      };
    }
  }
}
