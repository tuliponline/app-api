import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

export type OrderDocument = Order & Document;

export enum OrderStatus {
  CREATED = 'CREATED',
  FAIL = 'FAIL',
  SUCCESS = 'SUCCESS',
}

@Schema({ timestamps: true })
export class Order {

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Plan' })
  planId: Types.ObjectId;

  @Prop({ required: true })
  refno: string;

  @Prop({ required: true })
  customeremail: string;

  @Prop({ required: true })
  productdetail: string;

  @Prop({ required: true })
  total: number;

  @Prop({ required: true, enum: OrderStatus, default: OrderStatus.CREATED })
  status: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
