import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, productSchema } from '../schema/product.schema';
import { ProductController } from '../controllers/product.controller';
import { PRODUCT_SERVICE } from 'src/token';
import { ProductService } from '../services/product.service';
import { UserModule } from 'src/modules/user/module/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: productSchema }]),
    UserModule, 
  ],
  controllers: [ProductController],
  providers: [
    {
      provide: PRODUCT_SERVICE,
      useClass: ProductService,
    },
  ],
})
export class ProductModule {}
