import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Orderlist, orderlistSchema } from '../schema/order.schema';
import { User } from 'src/modules/guards/public.decorator';
import { userSchema } from 'src/modules/user/schema/user.schema';
import { Product, productSchema } from 'src/modules/product/schema/product.schema';
import { OrderController } from '../controllers/order.controller';
import { ORDER_SERVICE } from 'src/token';
import { OrderService } from '../services/order.service';
import { UserModule } from 'src/modules/user/module/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Orderlist.name, schema: orderlistSchema },
      { name: User.name, schema: userSchema},
      { name: Product.name, schema: productSchema },
    ]),
    UserModule,
  ],
  controllers: [OrderController],
  providers: [
    {
      provide: ORDER_SERVICE,
      useClass: OrderService,
    },
    OrderService
  ],
    exports:[
        OrderService,
       MongooseModule
    ]
})
export class OrderModule {}
