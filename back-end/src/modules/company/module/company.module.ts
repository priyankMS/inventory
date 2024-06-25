import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, companySchema } from '../schema/company.schema';
import { CompanyController } from '../controllers/company.controller';
import { COMPANY_SERVICE } from 'src/token';
import { CompanyService } from '../services/company.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Company.name, schema: companySchema}]),
  ],
  controllers: [CompanyController],
  providers: [
    {
      provide: COMPANY_SERVICE,
      useClass: CompanyService,
    },
  ],
})
export class CompanyModule {}
