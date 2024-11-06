import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PlanDocument = Plan & Document;

@Schema({ timestamps: true })
export class Plan {
  @Prop({ required: true })
  name: string;
  @Prop({ require: true })
  price: number;
  @Prop({ require: true })
  discount: number;
  @Prop()
  spacialPrice: number;
  @Prop()
  vat: number;
  @Prop()
  total: number;
  @Prop({ require: true })
  storage: number;
  @Prop({ require: true })
  pages: number;
  @Prop({ require: true })
  salePage: number;
  @Prop({ require: true })
  duration: number;
  @Prop({ require: true })
  isRecommended: boolean;
  @Prop({ require: true })
  isActive: boolean;
  @Prop()
  description: string;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);
