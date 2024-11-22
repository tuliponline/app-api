import { PaymentCallbackDto } from './dto/payment-callback.dto';
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
// import { CreateUserPlanDto } from 'src/user-plan/dto/create-user-plan.dto';
import { CreateOrderDto } from './dto/create-order.dto';
// import { UpdateOrderDto } from './dto/update-order.dto';
import { PlanService } from 'src/plan/plan.service';
import { Order, OrderDocument } from './schemas/order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderStatus } from './schemas/order.schema';
import stringGenerator from '@nakarmi23/random-string-generator';
import { UserPlanService } from 'src/user-plan/user-plan.service';
import {
  UserPlan,
  UserPlanDocument,
} from 'src/user-plan/schemas/user-plan.schema';
import { SuccessResponse } from '../responses/success.response';
import { SuccessResponseWithMeta } from '../responses/success.response.withmeta';
import { Meta } from 'src/responses/base.response';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    private readonly planService: PlanService,
    private readonly userPlanService: UserPlanService,
    @InjectModel(UserPlan.name)
    private readonly userPlanModel: Model<UserPlanDocument>,
    private readonly configService: ConfigService,
  ) {}
  async create(
    userEmail: string,
    userId: string,
    planId: string,
  ): Promise<SuccessResponse> {
    console.log('userId', userId);
    console.log('planId', planId);
    const plan = await this.planService.findOne(planId);

    if (!plan) {
      throw new NotFoundException('planId not found');
    }

    // const hasPlan = await this.userPlanService.checkHasPlan(userId);
    // if (hasPlan) {
    //   throw new ConflictException('User already has a plan');
    // }

    const finalPrict = plan.data.price - plan.data.discount;
    const vat = Math.round(finalPrict * 0.07);
    const total = finalPrict + vat;

    const createOrderDto = new CreateOrderDto();
    createOrderDto.planId = planId;
    createOrderDto.userId = userId;
    createOrderDto.customeremail = userEmail;
    createOrderDto.productdetail = plan.data.name;
    createOrderDto.price = plan.data.price;
    createOrderDto.discount = plan.data.discount;
    createOrderDto.vat = vat;
    createOrderDto.total = total;
    createOrderDto.status = OrderStatus.CREATED;

    let generatedRefno;
    let isUnique = false;

    while (!isUnique) {
      generatedRefno = stringGenerator(12, {
        lowercase: false,
        uppercase: false,
        symbol: false,
        number: true,
      });
      isUnique = await this.isRefnoUnique(generatedRefno);
    }

    createOrderDto.refno = generatedRefno;
    const merchantId = this.configService.get('MERCHANT_ID');

    try {
      const order = await new this.orderModel(createOrderDto).save();
      const response = {
        ...order.toObject(),
        merchantId: merchantId,
      };
      return new SuccessResponse(response);
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async isRefnoUnique(refno: string): Promise<boolean> {
    const existingOrder = await this.orderModel.findOne({ refno });
    return !existingOrder;
  }

  async PaymentCallbackDto(paymentCallbackDto: PaymentCallbackDto) {
    console.log('data', paymentCallbackDto);
    if (paymentCallbackDto.status === 'CP') {
      const order = await this.orderModel.findOneAndUpdate(
        { refno: paymentCallbackDto.refno },
        { status: OrderStatus.SUCCESS },
        { new: true },
      );
      if (!order) {
        throw new NotFoundException('order not found');
      }
      const userPlan = await this.userPlanService.create(
        order.userId.toString(),
        order.planId.toString(),
        paymentCallbackDto.orderno,
      );
      console.log('userPlan', userPlan);
      console.log('order', order);
    }
  }

  async findAll(
    page: number,
    limit: number,
    userId: string,
  ): Promise<SuccessResponseWithMeta> {
    const skip = (page - 1) * limit;
    const query = userId ? { userId } : {};
    const total = await this.orderModel.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const data = await this.orderModel.find(query).skip(skip).limit(limit);
    const meta: Meta = {
      total,
      page,
      limit,
      totalPages,
    };
    return new SuccessResponseWithMeta(data, 'success', meta);
  }
}
