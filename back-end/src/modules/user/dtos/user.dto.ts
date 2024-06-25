import { IsNotEmpty, IsString, IsEmail, IsNumberString, IsNumber } from 'class-validator';
import { Number } from 'mongoose';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  readonly fullname: string;

  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  
  readonly mobileNumber: Number;

  @IsNotEmpty()
  @IsString()
  readonly password: string;


}
