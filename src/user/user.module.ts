import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import {
  UserPlan,
  UserPlanSchema,
} from 'src/user-plan/schemas/user-plan.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserPlanModule } from 'src/user-plan/user-plan.module';
import { UploadImageModule } from 'src/upload-image/upload-image.module';

@Module({
  imports: [
    UserPlanModule,
    UploadImageModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: UserPlan.name, schema: UserPlanSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
