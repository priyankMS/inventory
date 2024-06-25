import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { userSchema, User } from '../schema/user.schema';
import { UserController } from '../controllers/user.controller';
import { USER_SERVICE } from 'src/token';
import { UserService } from '../services/user.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
    JwtModule.register({}),
    MailerModule.forRoot({
      transport: {
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      },
    }),
  ],
  controllers: [UserController],
  providers: [
    {
      provide: USER_SERVICE,
      useClass: UserService,
    },
    UserService, // Add UserService to the providers array
  ],
  exports: [
    UserService, // Export UserService so it can be used in other modules
    MongooseModule, // Export MongooseModule to share the schema
  ],
})
export class UserModule {}
