import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
export type TemplateDomainDocument = TemplateDomain & Document;

export enum DomainStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Schema({ timestamps: true , collection: 'template_domains' })
export class TemplateDomain {
  @Prop({ required: true })
  domainName: string;

  @Prop({ required: true, enum: DomainStatus, default: DomainStatus.PENDING })
  status: DomainStatus;

  @Prop({ required: true, unique: true })
  templateApp: string;

  @Prop({ required: true, type: Types.ObjectId })
  templateId: Types.ObjectId;
  
  @Prop({ required: false, type: Types.ObjectId })
  updateBy: Types.ObjectId;

  @Prop({ required: false})
  isEnable: boolean;
}

export const TemplateDomainSchema = SchemaFactory.createForClass(TemplateDomain);
