import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import {
  UserPlan,
  UserPlanDocument,
} from 'src/user-plan/schemas/user-plan.schema';
import { RegisterDto } from './dto/register-dto';
import { Model } from 'mongoose';
import { SuccessResponse } from '../responses/success.response';
import { UserPlanService } from 'src/user-plan/user-plan.service';
import { UserRole } from 'src/user/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(UserPlan.name)
    private readonly userPlanModel: Model<UserPlanDocument>,
    private readonly userPlanService: UserPlanService,
  ) {}
  async create(registerDto: RegisterDto) {
    const existingUser = await this.userModel
      .findOne({ email: registerDto.email })
      .exec();

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const newUser = new this.userModel(registerDto);
    await newUser.save();
    return new SuccessResponse(null, 'User created successfully');
  }

  async findByEmail(email: string): Promise<UserDocument> {
    const result = await this.userModel.findOne({ email }).exec();
    return result;
  }
  async findByUserId(_id: string): Promise<UserDocument> {
    const result = await this.userModel.findById(_id).exec();
    return result;
  }

  async isAdmin(userId: string): Promise<boolean> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.userRole === UserRole.ADMIN;
  }

  async findByEmailWithOutPassword(email: string): Promise<SuccessResponse> {
    const result = await this.userModel
      .findOne({ email })
      .select('-password')
      .select('__v')
      .exec();
    if (!result) {
      throw new NotFoundException('email not found');
    }
    const userPlans = await this.userPlanService.findByUserId(
      result._id.toString(),
    );
    const response = {
      ...result.toObject(), // Convert Mongoose document to plain object
      userPlans: userPlans,
    };

    return new SuccessResponse(response);
  }
}
