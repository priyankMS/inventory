import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/modules/user/module/user.module';
import { BusinessController } from '../controlles/business.controllers';
import { BUSINESS_SERVICE } from 'src/token';
import { BusinessService } from '../services/business.services';
import { Business, businessSchema } from '../schema/business.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Business.name, schema: businessSchema }]),
        UserModule,
    ],
    controllers: [BusinessController],
    providers: [
        {
            provide: BUSINESS_SERVICE,
            useClass: BusinessService,
        },
    ],
})
export class BusinessModule { }
