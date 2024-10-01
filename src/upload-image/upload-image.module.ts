import { Module, forwardRef } from '@nestjs/common';
import { UploadImageService } from './upload-image.service';
import { UploadImageController } from './upload-image.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadImage, UploadImageSchema } from './schemas/upload-image.schema';
import { UserModule } from '../user/user.module';
import {
  UploadImageScreenshot,
  UploadImageScreenshotSchema,
} from './schemas/upload-image-screenshot.schema';

@Module({
  imports: [
    forwardRef(() => UserModule),
    MongooseModule.forFeature([
      { name: UploadImage.name, schema: UploadImageSchema },
    ]),
    MongooseModule.forFeature([
      { name: UploadImageScreenshot.name, schema: UploadImageScreenshotSchema },
    ]),
  ],
  controllers: [UploadImageController],
  providers: [UploadImageService],
  exports: [UploadImageService],
})
export class UploadImageModule {}
