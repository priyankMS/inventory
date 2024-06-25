import { PartialType } from '@nestjs/mapped-types';
import { UserDto } from './user.dto';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(UserDto) {
    @Exclude()
    @IsNotEmpty()
    @IsString()
    readonly username: string;

    @Exclude()
    @IsNotEmpty()
    @IsString()
    readonly email: string;
}
