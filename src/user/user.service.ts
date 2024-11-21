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
import { UpdateProfileDto } from './dto/update-profile-dto';
import { Model, Types } from 'mongoose';
import { SuccessResponse } from '../responses/success.response';
import { UserPlanService } from 'src/user-plan/user-plan.service';
import { UserRole } from 'src/user/schemas/user.schema';
import { UploadImageService } from 'src/upload-image/upload-image.service';
import { BanksService } from 'src/banks/banks.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(UserPlan.name)
    private readonly userPlanModel: Model<UserPlanDocument>,
    private readonly userPlanService: UserPlanService,
    private readonly uploadImageService: UploadImageService,
    private readonly bankService: BanksService,
  ) { }
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
    try {
      const result = await this.userModel
        .findOne({ email })
        .select('-password')
        .select('__v')
        .populate('bankId')
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
    } catch (e) {
      console.log(e)
      throw e;
    }
  }

  async update(UpdateProfileDto: UpdateProfileDto, files: any, userId: string) {

    const { avatar, bankBookImage } = files;
    if (avatar?.length && avatar[0]?.buffer) {
      const fileName = avatar[0].originalname;
      UpdateProfileDto.avatar = await this.uploadImageService.uploadFileToS3(
        `users/${userId}/avatar/avatar-${userId}.${fileName.split('.').pop()}`,
        avatar.originalname,
        avatar[0].buffer,
      );
    } else {
      delete UpdateProfileDto.avatar;
    }

    if (bankBookImage?.length && bankBookImage[0]?.buffer) {
      const fileName = bankBookImage[0].originalname;
      UpdateProfileDto.bankBookImage = await this.uploadImageService.uploadFileToS3(
        `users/${userId}/bankBookImage/bankBookImage-${userId}.${fileName.split('.').pop()}`,
        bankBookImage.originalname,
        bankBookImage[0].buffer,
      );
    } else {
      delete UpdateProfileDto.bankBookImage;
    }

    const bank = await this.bankService.findOne(UpdateProfileDto.bankId.toString());
    if (!bank) {
      throw new NotFoundException('Bank not found');
    }

    if (UpdateProfileDto.bankId) {
      UpdateProfileDto.bankId = Types.ObjectId.createFromHexString(UpdateProfileDto.bankId.toString());
    }

    const result = await this.userModel.findByIdAndUpdate(userId, UpdateProfileDto, {
      new: true,
    }).exec();

    if (!result) {
      throw new NotFoundException('User not found');
    }

    return new SuccessResponse("updated successfully");
  }
}
