import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request,
  BadRequestException,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { UploadImageService } from './upload-image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { SuccessResponse } from 'src/responses/success.response';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('upload-image')
@Controller('upload-image')
export class UploadImageController {
  constructor(private readonly uploadImageService: UploadImageService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
      fileFilter: (req, file, cb) => {
        const ext = file.originalname.toLowerCase().split('.').pop();
        if (ext !== 'jpg' && ext !== 'png') {
          return new BadRequestException('Only jpg and png files are allowed');
        }
        cb(null, true);
      },
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File, @Request() req) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const buffer = file.buffer;
    const fileName = file.originalname;
    console.log(fileName);
    const imageData = await this.uploadImageService.uploadFile(
      req.user.userId,
      fileName,
      buffer,
    );
    const imageSize = buffer.length;
    console.log(imageSize);
    return new SuccessResponse({ imageData });
  }

  @UseGuards(JwtAuthGuard)
  @Post('/screenshot')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
      fileFilter: (req, file, cb) => {
        const ext = file.originalname.toLowerCase().split('.').pop();
        if (ext !== 'jpg' && ext !== 'png') {
          return new BadRequestException('Only jpg and png files are allowed');
        }
        cb(null, true);
      },
    }),
  )
  async uploadScreenshot(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const buffer = file.buffer;
    const fileName = file.originalname;
    console.log(fileName);
    const imageData = await this.uploadImageService.uploadFile(
      req.user.userId,
      fileName,
      buffer,
      true,
    );
    const imageSize = buffer.length;
    console.log(imageSize);
    return new SuccessResponse({ imageData });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/screenshot')
  async findScreenshotAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.uploadImageService.findScreenshotAll(page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/screenshot/:id')
  async findScreenshotOne(@Param('id') id: string, @Request() req) {
    const image = await this.uploadImageService.findOne(
      req.user.userId,
      id,
      true,
    );
    return new SuccessResponse({ image });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/screenshot/:id')
  async removeScreenshot(@Param('id') id: string, @Request() req) {
    return await this.uploadImageService.deleteImage(req.user.userId, id, true);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Request() req,
  ) {
    return await this.uploadImageService.findAll(page, limit, req.user.userId);
  }
  @UseGuards(JwtAuthGuard)
  @Get('/free')
  async findAdminImages(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.uploadImageService.findAdminImages(page, limit);
  }
  @UseGuards(JwtAuthGuard)
  @Get('/free/:id')
  async findAdminImage(@Param('id') id: string) {
    return await this.uploadImageService.findAdminImage(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/disk-used')
  async diskUsed(@Request() req) {
    return await this.uploadImageService.sumImageSizes(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const image = await this.uploadImageService.findOne(req.user.userId, id);
    return new SuccessResponse({ image });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return await this.uploadImageService.deleteImage(req.user.userId, id);
  }
}
