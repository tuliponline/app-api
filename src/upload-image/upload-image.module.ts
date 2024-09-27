import { Module } from '@nestjs/common';
import { UploadImageService } from './upload-image.service';
import { UploadImageController } from './upload-image.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadImage, UploadImageSchema } from './schemas/upload-image.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UploadImage.name, schema: UploadImageSchema },
    ]),
  ],
  controllers: [UploadImageController],
  providers: [UploadImageService],
  exports: [UploadImageService],
})
export class UploadImageModule {}
