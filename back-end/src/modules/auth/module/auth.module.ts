import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from '../controllers/auth.controller';
import { AUTH_SERVICE, USER_SERVICE } from 'src/token';
import { AuthService } from '../services/auth.service';
import { UserService } from 'src/modules/user/services/user.service';
import { AccessTokenStrategy } from '../guards/at.jwt';
import { RefreshTokenStrategy } from '../guards/rt.jwt';
import { UserModule } from 'src/modules/user/module/user.module';
import { localStrategy } from '../guards/local.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_ACCESS_EXPIRES'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    { provide: AUTH_SERVICE, useClass: AuthService },
    { provide: USER_SERVICE, useClass: UserService },
    localStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}

