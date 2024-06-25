import { Body, Controller, Get, Inject, Param, Patch, Post } from '@nestjs/common';
import { USER_SERVICE } from 'src/token';
import { UserService } from '../services/user.service';
import { Public } from 'src/modules/guards/public.decorator';
import { UserDto } from '../dtos/user.dto';
import { User } from '../schema/user.schema';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Controller('user')
export class UserController {
  constructor(
    @Inject(USER_SERVICE) private readonly userService: UserService,
  ) { }

  @Public()
  @Post('signup')
  createUser(@Body() createUser: UserDto) {
    return this.userService.createUser(createUser);
  }


  @Get("getall")
  async findAll(): Promise<User[]> {
    return this.userService.getAllUsers();
  }


  @Get('getone/:id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.getUserById(id);
  }


  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Public()
  @Get('verifyemail/:token')
  verifyEmail(@Param('token') token: string) {
    return this.userService.verifyEmail(token);
  }

  @Public()
  @Get('forgotpassword/:email')
  sendPasswordResetMail(@Param('email') email: string) {
    return this.userService.sendPasswordResetMail(email);
  }

  @Public()
  @Post('resetpassword')
  resetPassword(@Body() userData: any) {
    return this.userService.resetPassword(userData.token, userData.password);
  }
}
