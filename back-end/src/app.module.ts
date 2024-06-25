import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/module/user.module';
import { AuthModule } from './modules/auth/module/auth.module';
import { ProductModule } from './modules/product/module/product.module';
import { OrderModule } from './modules/order/module/order.module';
import { CompanyModule } from './modules/company/module/company.module';
import { BankModule } from './modules/bank/module/bank.module';
import { BusinessModule } from './modules/business/module/business.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UserModule,
    AuthModule,
    ProductModule,
    OrderModule,
    CompanyModule,
    BankModule,
    BusinessModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
