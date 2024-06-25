import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/modules/user/schema/user.schema';
import { Business } from '../schema/business.schema';
import { CreateBusinessDto } from '../dtos/create-business.dto';
import { UpdateBusinessDto } from '../dtos/update-business.dto';

export const populateOption = {
    path: 'createdBy',
    select: ['username'],
};

@Injectable()
export class BusinessService {
    constructor(
        @InjectModel(Business.name) private readonly businessModel: Model<Business>,
        @InjectModel(User.name) private readonly userModel: Model<User>,
    ) { }

    async create(user: any, createBusinessDto: CreateBusinessDto) {
        try {
            const userId = await this.userModel.findOne({ email: user.email });
            const createdBusiness = new this.businessModel({
                ...createBusinessDto,
                createdBy: userId._id,
            });
            await createdBusiness.save();
            return await this.businessModel.find({ createdBy: userId._id }).populate(populateOption);
        } catch (error) {
            throw new HttpException('Error creating business', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async update(user: any, id: string, updateBusinessDto: UpdateBusinessDto) {
        try {
            const userId = await this.userModel.findOne({ email: user.email });
            const business = await this.businessModel.findOneAndUpdate(
                { _id: id, createdBy: userId._id },
                updateBusinessDto,
                { new: true }
            ).populate(populateOption);

            if (!business) {
                throw new NotFoundException(`Business with ID ${id} not found`);
            }
            return business;
        } catch (error) {
            throw new HttpException('Error updating business', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getOne(user: any, id: string) {
        try {
            const userId = await this.userModel.findOne({ email: user.email });
            console.log(userId._id);
    
            const business = await this.businessModel.findOne({ _id: id, createdBy: userId._id }).populate(populateOption);
    
            if (!business) {
                throw new NotFoundException(`Business with ID ${id} not found`);
            }
            return business;
        } catch (error) {
            throw error; // rethrow the original error
        }
    }
    async getAll(user: any) {
        try {
            const userId = await this.userModel.findOne({ email: user.email });
            const businesses = await this.businessModel.find({ createdBy: userId._id }).populate(populateOption);
            return businesses;
        } catch (error) {
            throw new HttpException('Error retrieving businesses', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
