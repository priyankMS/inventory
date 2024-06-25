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
  } from '@nestjs/common';
  import { Request } from 'express';
  import { PRODUCT_SERVICE } from 'src/token';
import { ProductService } from '../services/product.service';
import { User } from 'src/modules/guards/public.decorator';
import { accessPayload } from '../interface/type';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
  
  @Controller('product')
  export class ProductController {
    constructor(
      @Inject(PRODUCT_SERVICE) private readonly productService: ProductService,
    ) {}
  
    @Post('create')
    create(
      @User() user: accessPayload,
      @Body() createProductDto: CreateProductDto,
    ) {
      return this.productService.create(user, createProductDto);
    }
  
    @Get('findall')
    getAll(@User() user: accessPayload) {
      return this.productService.getAll(user);
    }
  
    @Put('updateproducts/:id')
    updateProduct(
      @User() user: accessPayload,
      @Param('id') id: string,
      @Body() updateProductDto: UpdateProductDto,
    ) {
      return this.productService.update(user, id, updateProductDto);
    }
  
    @Delete('deleteone/:id')
    deleteone(@User() user: accessPayload, @Param('id') id: string) {
      return this.productService.deleteone(user, id);
    }
  }
  