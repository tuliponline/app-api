import { Module } from '@nestjs/common';
import { UserPlanService } from './user-plan.service';
import { UserPlanController } from './user-plan.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserPlan, UserPlanSchema } from './schemas/user-plan.schema';
import { PlanModule } from 'src/plan/plan.module';

@Module({
  imports: [
    PlanModule,
    MongooseModule.forFeature([
      { name: UserPlan.name, schema: UserPlanSchema },
    ]),
  ],
  controllers: [UserPlanController],
  providers: [UserPlanService],
  exports: [UserPlanService],
})
export class UserPlanModule {}
