import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bank } from '../schema/bank.schema';
import { CreateBankDto } from '../dtos/create-bank.dto';
import { UpdateBankDto } from '../dtos/update-bank.dto';



@Injectable()
export class BankService {
    constructor(
        @InjectModel(Bank.name) private bankModel: Model<Bank>,
    ) { }
    async create(createBankDto: CreateBankDto) {
        try {
            const bank = new this.bankModel(createBankDto);
            return await bank.save();
        } catch (error) {
            if (error.code === 11000) {
                const duplicateField = Object.keys(error.keyValue)[0];
                const duplicateValue = error.keyValue[duplicateField];
                throw new HttpException(
                    `${duplicateField.charAt(0).toUpperCase() + duplicateField.slice(1)} '${duplicateValue}' is already in use`,
                    HttpStatus.BAD_REQUEST,
                );
            } else if (error.name === 'ValidationError') {
                throw new HttpException(
                    `Validation failed: ${Object.values(error.errors).map((err: any) => err.message).join(', ')}`,
                    HttpStatus.BAD_REQUEST,
                );
            } else {
                throw new HttpException('Failed to create bank', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    // Get all banks
    async getAll() {
        return await this.bankModel.find().exec();
    }

    // Get a bank by ID
    async getById(id: string) {
        const bank = await this.bankModel.findById(id).exec();
        if (!bank) {
            throw new HttpException('Bank not found', HttpStatus.NOT_FOUND);
        }
        return bank;
    }

    // Update a bank by ID
    async update(id: string, updateBankDto: UpdateBankDto) {
        try {
            const updatedBank = await this.bankModel.findByIdAndUpdate(id, updateBankDto, { new: true, runValidators: true }).exec();
            if (!updatedBank) {
                throw new HttpException('Bank not found', HttpStatus.NOT_FOUND);
            }
            return updatedBank;
        } catch (error) {
            if (error.code === 11000) {
                const duplicateField = Object.keys(error.keyValue)[0];
                const duplicateValue = error.keyValue[duplicateField];
                throw new HttpException(
                    `${duplicateField.charAt(0).toUpperCase() + duplicateField.slice(1)} '${duplicateValue}' is already in use`,
                    HttpStatus.BAD_REQUEST,
                );
            } else if (error.name === 'ValidationError') {
                throw new HttpException(
                    `Validation failed: ${Object.values(error.errors).map((err: any) => err.message).join(', ')}`,
                    HttpStatus.BAD_REQUEST,
                );
            } else {
                throw new HttpException('Failed to update bank', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }


}
