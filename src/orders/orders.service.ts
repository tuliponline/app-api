import { Injectable } from '@nestjs/common';
// import { CreateUserPlanDto } from 'src/user-plan/dto/create-user-plan.dto';
// import { CreateOrderDto } from './dto/create-order.dto';
// import { UpdateOrderDto } from './dto/update-order.dto';
import { UserPlanService } from 'src/user-plan/user-plan.service';

@Injectable()
export class OrdersService {
  constructor(private readonly userPlanService: UserPlanService) {}
  // createUserPlan() {
  //   return this.userPlanService.create();
  // }

  // findAll() {
  //   return `This action returns all orders`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} order`;
  // }

  // update(id: number, updateOrderDto: UpdateOrderDto) {
  //   return `This action updates a #${id} order`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} order`;
  // }
}
