import { Controller, Post, Body, Req, UseGuards, Inject, Get, Param, Put } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BUSINESS_SERVICE } from 'src/token';
import { BusinessService } from '../services/business.services';
import { CreateBusinessDto } from '../dtos/create-business.dto';
import { UpdateBusinessDto } from '../dtos/update-business.dto';

@Controller('business')
export class BusinessController {
    constructor(@Inject(BUSINESS_SERVICE) private readonly businessService: BusinessService) { }

    @UseGuards(AuthGuard('jwt'))
    @Post('/create')
    async create(@Req() req: any, @Body() createBusinessDto: CreateBusinessDto) {
        const user = req.user;
        return this.businessService.create(user, createBusinessDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/getAll')
    async getAll(@Req() req: any) {
        const user = req.user;
        return this.businessService.getAll(user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/getOne/:id')
    async getOne(@Req() req: any, @Param('id') id: string) {
        const user = req.user;
        return this.businessService.getOne(user, id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/update/:id')
    async update(@Req() req: any, @Param('id') id: string, @Body() updateBusinessDto: UpdateBusinessDto) {
        const user = req.user;
        return this.businessService.update(user, id, updateBusinessDto);
    }
}
