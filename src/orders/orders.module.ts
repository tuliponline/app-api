import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { UserPlanModule } from 'src/user-plan/user-plan.module';
import { PlanModule } from 'src/plan/plan.module';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import {
  UserPlan,
  UserPlanSchema,
} from 'src/user-plan/schemas/user-plan.schema';

@Module({
  imports: [
    PlanModule,
    UserPlanModule,
    UserModule,
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([
      { name: UserPlan.name, schema: UserPlanSchema },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
