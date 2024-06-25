
import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from '../schema/user.schema';
import { UserService } from 'src/modules/user/services/user.service';
import { USER_SERVICE } from 'src/token';
import { compareHash, encrypt } from '../guards/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(USER_SERVICE) private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  async findUserByEmailOrUsername(email: string, username: string) {
    return await this.userModel.findOne({
      $or: [{ email }, { username }],
    });
  }

  async logout(user: any) {
    return await this.userModel.updateOne(
      { email: user.email },
      { $unset: { hashedRt: '' } }, 
    );
  }

  async validateUser(input: string, password: string) {
    const user = await this.findUserByEmailOrUsername(input, input); 
    if (!user) {
      console.error('User not found');
      return null;
    }
    if (!user.verified) {
      await this.userService.sendVerifyEmail(user.email);
      throw new BadRequestException('Please verify your email first');
    }
    const isValidPassword = await compareHash(password, user.password);
    if (!isValidPassword) {
      console.error('Password does not match');
      return null;
    }
    return this.generateTokens(user._id.toString(), user.username, user.email);
  }

  async refreshToken(rt: string, email: string) {
    const user = await this.findUserByEmailOrUsername(email, email); 
    if (!user) {
      throw new UnauthorizedException('Session timeout, please login again');
    }
    const { hashedRt } = user;
    if (!hashedRt) {
      throw new UnauthorizedException('Session timeout, please login again');
    }
    if (!compareHash(rt, hashedRt)) {
      return null; 
    }
    return this.generateTokens(user._id.toString(), user.username, user.email);
  }

  async generateTokens(
    id: string,
    username: string,
    email: string,
  ) {
    const accessToken = this.jwtService.sign(
      { id, username, email },
      {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: '15m',
      },
    );
    const refreshToken = this.jwtService.sign(
      { email },
      {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: '2h',
      },
    );
    const rtHash = encrypt(refreshToken);
    await this.userModel.updateOne({ email }, { hashedRt: rtHash });
    return { accessToken, refreshToken };
  }
}
