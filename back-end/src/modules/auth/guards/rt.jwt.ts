import { Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AuthService } from '../services/auth.service';
import { AUTH_SERVICE } from 'src/token';

export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(@Inject(AUTH_SERVICE) private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => request?.cookies?.authToken,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const rt = req.cookies.authToken;
    const { email } = payload;
    const { accessToken, refreshToken } = await this.authService.refreshToken(
      rt,
      email,
    );
    return { accessToken, refreshToken };
  }
}
