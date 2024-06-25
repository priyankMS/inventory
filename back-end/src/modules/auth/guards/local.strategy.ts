import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth.service';
import { AUTH_SERVICE } from 'src/token';

@Injectable()
export class localStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(@Inject(AUTH_SERVICE) private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid email or password');
    const { accessToken, refreshToken } = user;
    return { accessToken, refreshToken };
  }
}
