import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UploadImageScreenshotDocument = UploadImageScreenshot & Document;

@Schema({ timestamps: true })
export class UploadImageScreenshot {
  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true, unique: true })
  imageUrl: string;
}

export const UploadImageScreenshotSchema = SchemaFactory.createForClass(
  UploadImageScreenshot,
);
