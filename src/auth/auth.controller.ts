import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { SuccessResponse } from '../responses/success.response';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    const { accessToken } = await this.authService.login(req.user);
    return new SuccessResponse({ accessToken }, 'Login successfully');
  }
}
