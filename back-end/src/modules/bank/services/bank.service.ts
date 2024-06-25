// src/bank/bank.service.ts
import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bank } from '../schema/bank.schema';
import { CreateBankDto } from '../dtos/create-bank.dto';
import { UpdateBankDto } from '../dtos/update-bank.dto';
import { User } from 'src/modules/user/schema/user.schema';

export const populateOption = {
    path: 'createdBy',
    select: ['username'],
};

@Injectable()
export class BankService {
    constructor(
        @InjectModel(Bank.name) private readonly bankModel: Model<Bank>,
        @InjectModel(User.name) private userModel: Model<User>,
    ) { }

    async create(user: any, createBankDto: CreateBankDto) {
        try {
          const userId = await this.userModel.findOne({ email: user.email });
          const existingBank = await this.bankModel.findOne({
            bankName: createBankDto.bankName,
            ifscCode: createBankDto.ifscCode,
            accountNumber: createBankDto.accountNumber,
          });
      
          if (existingBank) {
            throw new HttpException('Bank already exists', HttpStatus.CONFLICT);
          }
      
          const createdProduct = new this.bankModel({
           ...createBankDto,
            createdBy: userId._id,
          });
      
          await createdProduct.save();
          return await this.bankModel.find({ createdBy: user.id }).populate(populateOption);
        } catch (error) {
          throw new HttpException('Error creating bank', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }

    async findAll() {
        return await this.bankModel.find().populate(populateOption).exec();
    }

    async findOne(id: string) {
        const bank = await this.bankModel.findById(id).populate(populateOption).exec();
        if (!bank) {
            throw new NotFoundException(`Bank with ID ${id} not found`);
        }
        return bank;
    }

    async update(id: string, updateBankDto: UpdateBankDto) {
        const updatedBank = await this.bankModel.findByIdAndUpdate(id, updateBankDto, { new: true }).exec();
        if (!updatedBank) {
            throw new NotFoundException(`Bank with ID ${id} not found`);
        }
        return updatedBank;
    }
}
