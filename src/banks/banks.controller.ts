import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UploadedFile, UseGuards, UseInterceptors, BadRequestException } from '@nestjs/common';
import { BanksService } from './banks.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('banks')
export class BanksController {
  constructor(private readonly banksService: BanksService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('logo', {
      limits: { fileSize: 5 * 1024 * 1024 }, // จำกัดขนาดไฟล์ (5 MB)
      fileFilter: (req, file, cb) => {
        const ext = file.originalname.toLowerCase().split('.').pop();
        if (ext !== 'jpg' && ext !== 'png') {
          return cb(
            new BadRequestException('Only jpg and png files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  create(@Body() createBankDto: CreateBankDto, @UploadedFile() file: Express.Multer.File) {
    return this.banksService.create(createBankDto, file);
  }

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('filters') filters?: string,
  ) {
    return this.banksService.findAll(page, limit, filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.banksService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('logo', {
      limits: { fileSize: 5 * 1024 * 1024 }, // จำกัดขนาดไฟล์ (5 MB)
      fileFilter: (req, file, cb) => {
        const ext = file.originalname.toLowerCase().split('.').pop();
        if (ext !== 'jpg' && ext !== 'png') {
          return cb(
            new BadRequestException('Only jpg and png files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  update(@Param('id') id: string, @Body() updateBankDto: UpdateBankDto, @UploadedFile() file: Express.Multer.File) {
    return this.banksService.update(id, updateBankDto, file);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.banksService.remove(id);
  }
}
