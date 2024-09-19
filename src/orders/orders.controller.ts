import {
  Controller,
  // Get,
  Post,
  // Body,
  // Patch,
  // Param,
  // Delete,
  Request,
  Body,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { CreateUserPlanDto } from 'src/user-plan/dto/create-user-plan.dto';
import { UserPlanService } from 'src/user-plan/user-plan.service';
// import { CreateOrderDto } from './dto/create-order.dto';
// import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly userPlanService: UserPlanService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createUserPlan(@Body() planId: string, @Request() req) {
    console.log('req.user.userId', req.user.userId);
    console.log('planId', planId);

    return this.userPlanService.create(req.user.userId, planId);
  }

  // @Get()
  // findAll() {
  //   return this.ordersService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.ordersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
  //   return this.ordersService.update(+id, updateOrderDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.ordersService.remove(+id);
  // }
}
