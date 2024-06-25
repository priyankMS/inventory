import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { isNotEmpty, IsString } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @IsString()

    updatedAt?: string;
}
