import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

export type UserPlanDocument = UserPlan & Document;

@Schema({ timestamps: true, versionKey: false })
export class UserPlan {
  @Prop()
  orderNo: string;
  @Prop({ required: true, Types: Types.ObjectId, ref: 'User', unique: true })
  userId: string;
  @Prop({ required: true })
  name: string;
  @Prop({ require: true })
  price: number;
  @Prop({ require: true })
  discount: number;
  @Prop({ require: true })
  vat: number;
  @Prop({ require: true })
  total: number;
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
  @Prop()
  hasExpired: boolean;
}

export const UserPlanSchema = SchemaFactory.createForClass(UserPlan);
