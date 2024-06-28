import {
    Body,
    Controller,
    Get,
    Inject,
    Param,
    Post,
    Query,
    Req,
    UploadedFile,
    UseInterceptors,
  } from '@nestjs/common';
  import { Request } from 'express';
  import { FileInterceptor } from '@nestjs/platform-express';
import { ORDER_SERVICE } from 'src/token';
import { OrderService } from '../services/order.service';
import { CreateOrderlistDto } from '../dtos/create-orderlist.dto';
  
  @Controller('order')
  export class OrderController {
    constructor(
      @Inject(ORDER_SERVICE) private readonly orderService: OrderService,
    ) {}
  
    @Post('create')
    create(@Req() req: Request, @Body() createorderlistDto: CreateOrderlistDto) {
      return this.orderService.create(req.user, createorderlistDto);
    }
  
    @Get('allData')
    getAllData(){
       return this.orderService.getAlldata();
    }
  
  
    @Post('invoice/:id')
    @UseInterceptors(FileInterceptor('image'))
    addInvoice(
      @UploadedFile() image: Express.Multer.File,
      @Param('id') id: string,
    ) {
      return this.orderService.addInvoice(image, id);
    }
  
    @Get('getall')
  findAll(@Req() req: Request, @Query('page') page: number = 1, @Query('limit') limit: number = 5) {
    return this.orderService.findAll(req.user, page, limit);
  }
  
    @Get('getone/:id')
    findOne(@Param('id') id: string) {
      return this.orderService.findOne(id);
    }
  }
  