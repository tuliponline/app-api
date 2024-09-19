import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { UserPlanModule } from 'src/user-plan/user-plan.module';

@Module({
  imports: [UserPlanModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
