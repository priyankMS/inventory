import { IsNotEmpty, IsString, IsEmail, Matches } from 'class-validator';

export class CreateBusinessDto {
    @IsNotEmpty()
    @IsString()
    readonly companyname: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @Matches(/^[a-zA-Z0-9]{15}$/, { message: 'GST number must be exactly 15 alphanumeric characters long' })
    readonly gst: string;

    @IsNotEmpty()
    @IsString()
    readonly phone: string;

    @IsNotEmpty()
    @IsString()
    readonly address: string;
}
