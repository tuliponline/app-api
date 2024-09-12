import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto } from './dto/register-dto';
import { Model } from 'mongoose';
import { SuccessResponse } from '../responses/success.response';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
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

  async findByEmailWithOutPassword(email: string): Promise<SuccessResponse> {
    const result = await this.userModel
      .findOne({ email })
      .select('-password')
      .select('__v')
      .exec();
    if (!result) {
      throw new NotFoundException('email not found');
    }
    return new SuccessResponse(result);
  }
}
