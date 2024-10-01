import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { UserRole } from 'src/user/schemas/user.schema';
export type UploadImageDocument = UploadImage & Document;

@Schema({ timestamps: true })
export class UploadImage {
  @Prop({ required: true, Types: Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true, unique: true })
  imageUrl: string;

  @Prop({ required: true })
  size: number;
  @Prop({ required: true, enum: UserRole, default: UserRole.USER })
  createdBy: UserRole;
}

export const UploadImageSchema = SchemaFactory.createForClass(UploadImage);
