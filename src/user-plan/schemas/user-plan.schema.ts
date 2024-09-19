import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsMongoId } from 'class-validator';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

export type UserPlanDocument = UserPlan & Document;

@Schema({ timestamps: true })
export class UserPlan {
  @Prop({ required: true, type: Types.ObjectId })
  orderId: string;
  @Prop({ required: true, type: IsMongoId })
  userId: string;
  @Prop({ required: true })
  name: string;
  @Prop({ require: true })
  price: number;
  @Prop({ require: true })
  collaborators: number;
  @Prop({ require: true })
  storage: number;
  @Prop({ require: true })
  pages: number;
  @Prop({ require: true })
  free_domains: number;
  @Prop({ require: true })
  marketing_suite: string;
  @Prop({ require: true })
  siteAnalytics: string;
  @Prop({ require: true })
  ecommerce: string;
  @Prop({ required: true, type: Date })
  startDate: Date;
  @Prop({ required: true, type: Date })
  endDate: Date;
}

export const UserPlanSchema = SchemaFactory.createForClass(UserPlan);
