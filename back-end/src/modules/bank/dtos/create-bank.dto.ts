import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateBankDto {
    @IsNotEmpty()
    @IsString()
    readonly bankName: string;

    @IsNotEmpty()
    @IsString()
    @Length(11, 11)
    readonly ifscCode: string;

    @IsNotEmpty()
    @IsString()
    readonly accountNumber: string;
}
