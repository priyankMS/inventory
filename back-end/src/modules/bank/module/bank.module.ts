import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BankService } from '../services/bank.service';
import { BankController } from '../controllers/bank.controller';
import { Bank, bankSchema } from '../schema/bank.schema';
import { UserModule } from 'src/modules/user/module/user.module';
import { BANK_SERVICE } from 'src/token';
import { BusinessModule } from 'src/modules/business/module/business.module';
import { OrderModule } from 'src/modules/order/module/order.module';
// import { BusinessModule } from 'src/modules/business/module/business.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: Bank.name, schema: bankSchema }]),
        UserModule,BusinessModule,OrderModule
        
    ],
    controllers: [BankController],
    providers: [
        {
            provide: BANK_SERVICE,
            useClass: BankService,
        },
    ],
})
export class BankModule { }
