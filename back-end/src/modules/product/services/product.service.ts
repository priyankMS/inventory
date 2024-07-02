import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../schema/product.schema';
import { User } from 'src/modules/user/schema/user.schema';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';

export const populateOption = {
  path: 'createdBy',
  select: ['username'],
};

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) { }

  async create(user: any, createProductDto: CreateProductDto) {
    try {
      const userId = await this.userModel.findOne({ email: user.email });
      const createdProduct = new this.productModel({
        ...createProductDto,
        createdBy: userId._id,
      });
      if (!createdProduct) {
        throw new HttpException(' products Not created', HttpStatus.NOT_FOUND);
      }
      await createdProduct.save();
      return await this.productModel
        .find({ createdBy: user.id })
        .populate(populateOption);
    } catch (error) {
      throw new HttpException(
        'Error creating product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAll(user: any, page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      const findall = await this.productModel
        .find({ createdBy: user.id })
        .skip(skip)
        .limit(limit)
        .populate(populateOption);
      if (!findall) {
        throw new HttpException('No products found', HttpStatus.NOT_FOUND);
      }
      return findall;
    } catch (error) {
      throw new HttpException(
        'Error fetching products',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOne(id: string): Promise<Product> {
    try {
      const findone = await this.productModel
        .findById(id)
        .populate(populateOption);
      if (!findone) {
        throw new HttpException('No products found', HttpStatus.NOT_FOUND);
      }
      return findone;
    } catch (error) {
      throw new HttpException(
        'Error fetching product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    user: any,
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product[]> {
    try {
      const existingProduct = await this.productModel
        .findByIdAndUpdate(id)
        .exec();
      if (!existingProduct) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      Object.assign(existingProduct, updateProductDto);
      await existingProduct.save();
      return await this.productModel
        .find({ createdBy: user.id })
        .populate(populateOption);
    } catch (error) {
      throw new HttpException(
        'Error updating product ',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove() {
    const deleteall = await this.productModel.deleteMany();
    try {
      if (!deleteall) {
        throw new HttpException('No products found', HttpStatus.NOT_FOUND);
      }
      return 'All products removed';
    } catch (error) {
      throw new HttpException(
        'Error not delete products',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteone(user: any, id: string): Promise<Product[]> {
    try {
      const deleteone = await this.productModel.findByIdAndDelete(id).exec();
      if (!deleteone) {
        throw new HttpException('No products found', HttpStatus.NOT_FOUND);
      }
      return await this.productModel
        .find({ createdBy: user.id })
        .populate(populateOption);
    } catch (error) {
      throw new HttpException(
        'Error deleting product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
