import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PlanDocument = Plan & Document;

@Schema({ timestamps: true })
export class Plan {
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
  freeDomains: number;
  @Prop({ require: true })
  marketing_suite: string;
  @Prop({ require: true })
  siteAnalytics: string;
  @Prop({ require: true })
  ecommerce: string;
  @Prop({ require: true })
  isRecommended: boolean;
  @Prop({ require: true })
  isActive: boolean;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);
