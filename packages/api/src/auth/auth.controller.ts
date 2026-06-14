import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtGuard } from './guards/jwt.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: any) {
    const result = await this.authService.register(dto);
    return {
      success: true,
      message: 'Registration successful',
      data: result,
    };
  }

  @Post('login')
  async login(@Body() dto: { email: string; password: string }) {
    const result = await this.authService.login(dto.email, dto.password);
    return {
      success: true,
      message: 'Login successful',
      data: result,
    };
  }

  @Get('me')
  @UseGuards(JwtGuard)
  async me(@Req() req: any) {
    const result = await this.authService.me(req.user.sub || req.user.id);
    return {
      success: true,
      message: 'User found',
      data: result,
    };
  }
}