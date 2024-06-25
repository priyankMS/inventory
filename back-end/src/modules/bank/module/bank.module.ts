import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BankService } from '../services/bank.service';
import { BankController } from '../controllers/bank.controller';
import { Bank, bankSchema } from '../schema/bank.schema';
import { UserModule } from 'src/modules/user/module/user.module';
import { BANK_SERVICE } from 'src/token';

@Module({
    imports: [MongooseModule.forFeature([{ name: Bank.name, schema: bankSchema }]),
        UserModule,
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
