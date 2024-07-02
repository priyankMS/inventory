import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from '../schema/company.schema';
import { CompanyDto, UpdateCompanyDto } from '../dtos/company.dto';

@Injectable()
export class CompanyService { 
  constructor(
    @InjectModel(Company.name) private companyModel: Model<Company>,
  ) {}

  async create(user: any, company: CompanyDto) {
    try {
      const createdBy = user.id;
      const newCompany = new this.companyModel({ ...company, createdBy });
      await newCompany.save();
      return await this.companyModel.find({ createdBy: user.id });
    } catch (error) {
      throw new HttpException(
        'Unable to create company record',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAll(user: any, page: number = 1, limit: number = 10): Promise<Company[]> {
    try {
      const skip = (page - 1) * limit;
      return await this.companyModel
        .find({ createdBy: user.id })
        .skip(skip)
        .limit(limit);
    } catch (error) {
      throw new HttpException(
        'Unable to fetch company records',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateCompany(
    user: any,
    id: string,
    newCompany: UpdateCompanyDto,
  ): Promise<Company[]> {
    try {
      await this.companyModel.updateOne(
        { _id: id, createdBy: user.id },
        { company: newCompany.company, products: newCompany.products },
      );
      return await this.companyModel.find({ createdBy: user.id });
    } catch (error) {
      throw new HttpException(
        'Unable to update record',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteOne(user: any, id: string): Promise<Company[]> {
    try {
      await this.companyModel.deleteOne({ _id: id });
      return await this.companyModel.find({ createdBy: user.id });
    } catch (error) {
      throw new HttpException(
        'Unable to delete record',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
