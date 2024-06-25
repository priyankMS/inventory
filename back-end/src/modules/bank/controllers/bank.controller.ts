import { Controller, Post, Body, Req, UseGuards, Inject, Get, Param, Put } from '@nestjs/common';
import { CreateBankDto } from '../dtos/create-bank.dto';
import { AuthGuard } from '@nestjs/passport';
import { BankService } from '../services/bank.service';
import { BANK_SERVICE } from 'src/token';
import { UpdateBankDto } from '../dtos/update-bank.dto';

@Controller('banks')
export class BankController {
    constructor(@Inject(BANK_SERVICE) private readonly bankService: BankService) { }
    @UseGuards(AuthGuard('jwt'))
    @Post("/create")
    async create(@Req() req: any, @Body() createBankDto: CreateBankDto) {
        const user = req.user;
        return this.bankService.create(user, createBankDto);
    }


    @UseGuards(AuthGuard('jwt'))
    @Get("/allbank")
    async findAll() {
        return this.bankService.findAll();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('onebank/:id')
    async findOne(@Param('id') id: string) {
        return this.bankService.findOne(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('updatebank/:id')
    async update(@Param('id') id: string, @Body() updateBankDto: UpdateBankDto) {
        return this.bankService.update(id, updateBankDto);
    }
}
