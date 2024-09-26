import {
  Controller,
  Get,
  Post,
  Query,
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
import { CreateOrderDto } from './dto/create-order.dto';
import { PaymentCallbackDto } from './dto/payment-callback.dto';
import { ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';
// import { CreateOrderDto } from './dto/create-order.dto';
// import { UpdateOrderDto } from './dto/update-order.dto';

@ApiTags('order')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly userPlanService: UserPlanService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return this.ordersService.create(
      req.user.email,
      req.user.userId,
      createOrderDto.planId,
    );
  }

  @ApiExcludeEndpoint()
  @Post('payment-callback')
  paymentCallback(@Body() paymentCallbackDto: PaymentCallbackDto) {
    this.ordersService.PaymentCallbackDto(paymentCallbackDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Request() req,
  ) {
    return this.ordersService.findAll(page, limit, req.user.userId);
  }
}
