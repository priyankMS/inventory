import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    Post,
    Put,
    Req,
    UseGuards,
} from '@nestjs/common';
import { BankService } from '../services/bank.service';
import { CreateBankDto } from '../dtos/create-bank.dto';
import { BANK_SERVICE } from 'src/token';
import { Bank } from '../schema/bank.schema';
import { UpdateBankDto } from '../dtos/update-bank.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('banks')
export class BankController {
    constructor(
        @Inject(BANK_SERVICE) private readonly bankService: BankService,
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Post("create")
    async create(@Body() createBankDto: CreateBankDto): Promise<Bank> {
        return this.bankService.create(createBankDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get("/getall")
    async getAll() {
        return this.bankService.getAll();
    }


    @UseGuards(AuthGuard('jwt'))
    @Get('getone/:id')
    async getById(@Param('id') id: string) {
        return this.bankService.getById(id);
    }


    @UseGuards(AuthGuard('jwt'))
    @Put('update/:id')
    async update(@Param('id') id: string, @Body() updateBankDto: UpdateBankDto) {
        return this.bankService.update(id, updateBankDto);
    }


}
