import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bank } from '../schema/bank.schema';
import { CreateBankDto } from '../dtos/create-bank.dto';
import { UpdateBankDto } from '../dtos/update-bank.dto';
import * as PDFDocument from 'pdfkit';
import * as PdfTable from "voilab-pdf-table"
import { PDFKit } from 'pdfkit';
import { buffer } from 'stream/consumers';
import { User } from 'src/modules/user/schema/user.schema';
import { Business } from 'src/modules/business/schema/business.schema';
import { Orderlist } from 'src/modules/order/schema/order.schema';

@Injectable()
export class BankService {
  constructor(
    @InjectModel(Bank.name) private bankModel: Model<Bank>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Business.name) private businessModel: Model<Business>,
    @InjectModel(Orderlist.name) private orderModel: Model<Orderlist>,
  ) {}
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
          `Validation failed: ${Object.values(error.errors)
            .map((err: any) => err.message)
            .join(', ')}`,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(
          'Failed to create bank',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
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
      const updatedBank = await this.bankModel
        .findByIdAndUpdate(id, updateBankDto, {
          new: true,
          runValidators: true,
        })
        .exec();
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
          `Validation failed: ${Object.values(error.errors)
            .map((err: any) => err.message)
            .join(', ')}`,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(
          'Failed to update bank',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }


  

  
 
  async generateInvoice(user: any): Promise<Buffer> {
    try {
        const userId = await this.userModel.findOne({ email: user.email });
        const userData = await this.userModel.findOne({ email: user.email });
        const business = await this.businessModel.findOne({ createdBy: userId._id });
        const bankData = await this.bankModel.find({ createdBy: userId._id });
        const totalOrder = await this.orderModel.find({ createdBy: userId._id });

        const invoiceData = {
            date: new Date().toLocaleDateString(),
        };

        const pdfBuffer: Buffer = await new Promise((resolve) => {
            const doc = new PDFDocument({
                size: 'A4',
                margin: 50,
                bufferPages: true,
            });

            // Invoice header
            doc.fontSize(20).text('Invoice', { align: 'right' }).moveDown(1);

            // Personal, Business, and Bank details (as before)
            const PersonalData = {
                name: userData?.fullname,
                email: userData?.email,
                phone: userData?.mobileNumber,
            };
            const BusinessData = {
                companyname: business?.companyname,
                email: business?.email,
                phone: business?.phone,
                gst: business?.gst,
                address: business?.address,
            };
            const BankData = {
                bankname: bankData[0]?.bankName,
                accountnumber: bankData[0]?.accountNumber,
                ifsc: bankData[0]?.ifsccode,
            };

            // Start coordinates for the text
            const startX = 50;
            const startY = 130; 

            
            doc.fontSize(16).font('Helvetica-Bold').text('Personal Details', startX, startY - 20).moveDown(1);
            doc.fontSize(12).font('Helvetica-Bold').text('Name:', startX, startY, { continued: true }).font('Helvetica').text(` ${PersonalData.name}`);

            // Absolute position for the date on the same line as the name
            doc.fontSize(12).text(`Date: ${invoiceData.date}`, 450, startY, { align: 'right' });

            
            const nextY = startY + 20; 

            // Email and phone details
            doc.fontSize(12).font('Helvetica-Bold').text('Email:', startX, nextY, { continued: true }).font('Helvetica').text(` ${PersonalData.email}`).moveDown(0.5);
            doc.fontSize(12).font('Helvetica-Bold').text('Phone:', startX, doc.y, { continued: true }).font('Helvetica').text(` ${PersonalData.phone}`).moveDown(0.5);

            const lineY = doc.y + 10; 
            doc.moveTo(startX, lineY)
                .lineTo(doc.page.width - doc.page.margins.right, lineY)
                .stroke();

            const businessY = lineY + 20;
            doc.fontSize(16).font('Helvetica-Bold').text('Business Details', startX, businessY - 5).moveDown(1.5);
            doc.fontSize(16).font('Helvetica-Bold').text('Bank Details', 400, businessY - 5, { align: 'right' }).moveDown(1.5);

           
            let currentY = businessY + 20;
            doc.fontSize(12).font('Helvetica-Bold').text('Company Name:', startX, currentY, { continued: true }).font('Helvetica').text(` ${BusinessData.companyname}`).moveDown(0.5);
            currentY = doc.y;

            doc.fontSize(12).font('Helvetica-Bold').text('Business Email:', startX, currentY, { continued: true }).font('Helvetica').text(` ${BusinessData.email}`).moveDown(0.5);
            currentY = doc.y;

            doc.fontSize(12).font('Helvetica-Bold').text('Business Phone:', startX, currentY, { continued: true }).font('Helvetica').text(` ${BusinessData.phone}`).moveDown(0.5);
            currentY = doc.y;

            doc.fontSize(12).font('Helvetica-Bold').text('GST:', startX, currentY, { continued: true }).font('Helvetica').text(` ${BusinessData.gst}`).moveDown(0.5);
            currentY = doc.y;

            doc.fontSize(12).font('Helvetica-Bold').text('Address:', startX, currentY, { continued: true }).font('Helvetica').text(` ${BusinessData.address}`).moveDown(0.5);
            currentY = doc.y;

           
            const bankStartY = businessY + 20;
            doc.fontSize(12).font('Helvetica-Bold').text(`Bank Name: ${BankData.bankname} `, 400, bankStartY, { align: 'right' }).moveDown(0.5);

            doc.fontSize(12).font('Helvetica-Bold').text(`Ac NO:${BankData.accountnumber}`, 400, doc.y, { align: 'right', continued: true }).moveDown(0.5);

            doc.fontSize(12).font('Helvetica-Bold').text(`IFSC:${BankData.ifsc}`, 400, doc.y, { align: 'right' }).moveDown(0.5);

       
            const lineY2 = Math.max(currentY, doc.y);
            doc.moveTo(startX, lineY2).lineTo(doc.page.width - doc.page.margins.right, lineY2).stroke();

            doc.fontSize(16).text('Invoice Items', 50, doc.y + 50, { align: 'left' }).moveDown(0.5);
            doc.fontSize(14).font('Helvetica')
            const table = new PdfTable(doc, {
                bottomMargin: 10,
            });

            table
            .setColumnsDefaults({
                headerBorder: ['B', 'T', 'L', 'R'],
                border: ['B', 'T', 'L', 'R'],
                width: 'wrap',
                padding: 5,
                align:"center",
                justify: 'center',
                margin: { top: 0, left: 0, bottom: 0, right: 0 },
            })
            .addColumns([
                {
                    id: 'no',
                    header: 'Id',
                    align: 'center',
                    justify: 'center',
                    width: 30,
                    headerBorder: 'TBLR',
                    border: 'TBLR',
                    
                },
                {
                    id: 'company',
                    header: 'Company',
                    width: 100,
                    headerBorder: 'TBLR',
                    border: 'TBLR',
                },
                {
                    id: 'date',
                    header: 'Date',
                    width: 150,
                    headerBorder: 'TBLR',
                    border: 'TBLR',
                },
                {
                    id: 'orderDetail',
                    header: 'Order Detail',
                    width: 200,
                    headerBorder: 'TBLR',
                    border: 'TBLR',
                },
            ])
            

       
        table.addBody(
            totalOrder.map((order, index) => ({
                no: index + 1,
                company: order.companyname,
                date: new Date(order.date).toLocaleDateString(),
                orderDetail: order.orderdetail.map(item => `${item.productname}: ${item.quantity}`).join('\n'),
            })),
        );

        doc.moveDown(2);
        doc.fontSize(12).text('Note: This invoice is for your records only.', startX, doc.y, { align: 'left' });

        doc.end();
        // Collect the buffer data
        const buffer = [];
        doc.on('data', buffer.push.bind(buffer));
        doc.on('end', () => {
            resolve(Buffer.concat(buffer));
        });
    });

    return pdfBuffer;

    } catch (error) {
        console.error('Error generating invoice:', error);
        throw error;
    }
}

  
}
