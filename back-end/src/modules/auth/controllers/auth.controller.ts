
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AUTH_SERVICE } from 'src/token';
import { AuthService } from '../services/auth.service';
import { Public } from 'src/modules/guards/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: AuthService,
  ) { }

  @Public()
  @Post('login')
  async login(@Body() body: { input: string; password: string }, @Res() res: Response) {
    const { input, password } = body;
    const tokens = await this.authService.validateUser(input, password);
    if (!tokens) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const { accessToken, refreshToken } = tokens;
    res.cookie('authToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return res.send({ accessToken });
  }

  @Get('logout')
  async logout(@Req() req: Request) {
    const user = await this.authService.logout(req.user);
    if (user) return 'User logged out successfully';
  }

  @Public()
  @UseGuards(AuthGuard('jwt-refresh'))
  @Get('refresh')
  refresh(@Req() req: Request, @Res() res: Response) {
    const { accessToken, refreshToken } = req.user as any;
    res.cookie('authToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return res.send(accessToken);
  }
}
