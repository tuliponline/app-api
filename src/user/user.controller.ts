import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Patch,
  Param,
  UseInterceptors,
  BadRequestException,
  UploadedFiles
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register-dto';
import { UpdateProfileDto } from './dto/update-profile-dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  create(@Body() registerDto: RegisterDto) {
    return this.userService.create(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  getMe(@Request() req) {
    const user = this.userService.findByEmailWithOutPassword(req.user.email);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/me')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor(
    [
      { name: 'avatar', maxCount: 1 },
      { name: 'bankBookImage', maxCount: 1 },
    ],
    {
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
    }
  ))
  updateMe(
    @Body() UpdateProfileDto: UpdateProfileDto, 
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File;
      bankBookImage?: Express.Multer.File;
    },
    @Request() req
  ) {
    return this.userService.update(UpdateProfileDto, files ,req.user.userId);
  }
}
