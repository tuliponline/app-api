import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { UserRole } from 'src/user/schemas/user.schema';
export type TemplateDocument = Template & Document;

export enum TemplateStatus {
  PUBLISH = 'PUBLISH',
  DRAFT = 'DRAFT',
  DISABLE = 'DISABLE',
}

export enum PageFor {
  ME = 'ME',
  CUSTOMER = 'CUSTOMER',
}
export enum PageType {
  ECOMMERCE = 'ECOMMERCE',
  MARKETING = 'MARKETING',
  SALEPAGE = 'SALEPAGE',
  BLOG = 'BLOG',
  NEWSLETTER = 'NEWSLETTER',
  PORTFOLIO = 'PORTFOLIO',
}

@Schema({ timestamps: true })
export class Template {
  @Prop({ required: true, enum: PageFor, default: PageFor.ME })
  pageFor: PageFor;
  @Prop({ required: true, enum: PageType, default: PageType.ECOMMERCE })
  pageType: PageType;
  @Prop({ required: true, type: Types.ObjectId })
  templateId: Types.ObjectId;
  @Prop({ required: true, type: Types.ObjectId })
  userId: Types.ObjectId;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  app: string;
  @Prop({ required: true })
  image: string;
  @Prop({ required: true })
  components: [];
  @Prop({ required: true })
  pages: [];
  @Prop({ required: true, enum: TemplateStatus, default: TemplateStatus.DRAFT })
  status: TemplateStatus;
  @Prop({ required: true, enum: UserRole })
  createdBy: UserRole;
}

export const TemplateSchema = SchemaFactory.createForClass(Template);
