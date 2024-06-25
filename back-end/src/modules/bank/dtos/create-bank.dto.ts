// create-bank.dto.ts
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateBankDto {
    @IsNotEmpty()
    @IsString()
    bankName: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(11)
    ifsccode: string;

    @IsNotEmpty()
    @IsString()
    accountNumber: string;

    @IsNotEmpty()
    @IsString()
    city: string;

    @IsNotEmpty()
    @IsString()
    state: string;

    @IsNotEmpty()
    @IsString()
    address: string;
}
