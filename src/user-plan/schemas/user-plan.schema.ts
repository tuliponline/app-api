import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

export type UserPlanDocument = UserPlan & Document;

@Schema({ timestamps: true })
export class UserPlan {
  @Prop({ required: true, Types: Types.ObjectId })
  orderId: Types.ObjectId;
  @Prop({ required: true, Types: Types.ObjectId, ref: 'User' })
  userId: string;
  @Prop({ required: true })
  name: string;
  @Prop({ require: true })
  price: number;
  @Prop({ require: true })
  storage: number;
  @Prop({ require: true })
  pages: number;
  @Prop({ require: true })
  salePage: number;
  @Prop({ require: true })
  duration: number;
  @Prop({ required: true, type: Date })
  startDate: Date;
  @Prop({ required: true, type: Date })
  endDate: Date;
}

export const UserPlanSchema = SchemaFactory.createForClass(UserPlan);
