import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register-dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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
    const user = this.userService.findByEmail(req.user.email);
    return user;
  }
}
