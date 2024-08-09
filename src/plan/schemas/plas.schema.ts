import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { TimeService } from 'src/shared/services/time.service';

export type PlanDocument = Plan & Document;

@Schema()
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
  free_domains: number;
  @Prop({ require: true })
  marketing_suite: string;
  @Prop({ require: true })
  site_analytics: string;
  @Prop({ require: true })
  ecommerce: string;
  @Prop({ require: true })
  is_recommended: boolean;
  @Prop({ require: true })
  is_active: boolean;
  @Prop({
    type: MongooseSchema.Types.Date,
    default: () => new TimeService().getNowInTST(),
  })
  created_at: Date;
  @Prop({
    type: MongooseSchema.Types.Date,
    default: () => new TimeService().getNowInTST(),
  })
  updated_at: Date;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);
