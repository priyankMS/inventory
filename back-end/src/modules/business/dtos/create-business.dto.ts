import { IsNotEmpty, IsString, IsEmail, Matches } from 'class-validator';

export class CreateBusinessDto {
    @IsNotEmpty()
    @IsString()
    readonly companyname: string;

    @IsNotEmpty()
    @IsEmail()
    readonly emails: string;

    @IsNotEmpty()
    @Matches(/^[a-zA-Z0-9]{15}$/, { message: 'GST number must be exactly 15 alphanumeric characters long' })
    readonly gstnumber: string;

    @IsNotEmpty()
    @IsString()
    readonly mobailnumber: string;

    @IsNotEmpty()
    @IsString()
    readonly Address: string;
}
