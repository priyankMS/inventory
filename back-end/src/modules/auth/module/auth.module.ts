import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
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
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: AUTH_SERVICE,
      useClass: AuthService,
    },
    {
      provide: USER_SERVICE,
      useClass: UserService,
    },
    localStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule { }
