// src/bill/bill.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Bill } from '../schemas/bill.schema';
import mongoose, { Model } from 'mongoose';
import { CreateBillDto } from '../dto/bill.dto';
import { ObjectId } from 'bson';
import { Finance } from 'src/schemas/finance.schema';
@Injectable()
export class BillService {
  constructor(@InjectModel(Bill.name) private billModel: Model<Bill>,@InjectModel(Finance.name) private readonly financeModel: Model<Finance>) {}


  // async createBill(createBillDto: CreateBillDto): Promise<Bill> {
  //   const bill = new this.billModel(createBillDto);
  //   const savedBill = await bill.save();
  
  //   // Now create finance entry if needed
  //   const financeData = {
  //     financerName: 'Default Financer', // or from DTO
  //     downpayment: 10000,
  //     emiTenure: 12,
  //     roi: 12.5,
  //     discount: 0,
  //     priceAfterFinance: createBillDto.totalAmount,
  //     product_id: createBillDto.product_id,
  //     bill_id: savedBill._id,
  //   };
  
  //   const createdFinance = await this.financeModel.create(financeData);
  
  //   // Update the saved bill with finance_id
  //   savedBill.finance_id = createdFinance._id;
  //   await savedBill.save();
  
  //   return savedBill;
  // }
  

  async createBill(createBillDto: CreateBillDto) {
    const session = await this.billModel.db.startSession();
    session.startTransaction();
  
    try {
      const {
        isFinance,
        finance,
        ...billData
      } = createBillDto;
  
      // Create the bill first
      const bill = new this.billModel(billData);
      await bill.save({ session });
  
      // Create finance entry if isFinance flag is true
      if (isFinance && finance) {
        const financeData = {
          ...finance,
          bill_id: bill._id,
        };
  
        const financeEntry = new this.financeModel(financeData);
        await financeEntry.save({ session });
  
        // Optionally: store financeId in bill document
        // If needed, add a `finance_id` field in your Bill schema
        bill.finance_id = financeEntry._id as ObjectId;
        await bill.save({ session });
      }
  
      await session.commitTransaction();
      session.endSession();
  
      return {
        message: 'Bill created successfully',
        billId: bill._id,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error('Error creating bill with finance:', error);
      throw new BadRequestException('Failed to create bill: ' + error.message);
    }
  }
  

  async getBillsByUser(query) {
    try {
      const page = parseInt(query.page) || 1;
      const limit = parseInt(query.limit) || 10;
      const skip = (page - 1) * limit;
  
      let filter = {};
      if (query.formType && query.formType !== '' && query.formType !== 'Select All') {
        filter ={
          formType: query.formType
        }
      }
  
      const [bills, total] = await Promise.all([
        this.billModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        this.billModel.countDocuments(filter),
      ]);
  
      return {
        bills,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }
  
  
  async getBillById() {
    try {
      const bill = await this.billModel.find().populate('finance_id').lean();
  
      if (!bill) {
        throw new NotFoundException('Bill not found');
      }
  
      return bill
    } catch (error) {
      console.error('Error fetching bill:', error);
      throw new BadRequestException('Failed to fetch bill: ' + error.message);
    }
  }
  

  async updateBill(billId, body: Partial<Bill>) {
    try {
      console.log({billId})
      const objectId = new ObjectId(billId);
      const updatedBill = await this.billModel.findByIdAndUpdate(
        {_id:billId.id},
        { $set: body },
        { new: true } 
      );
  
      if (!updatedBill) {
        throw new Error('Bill not found');
      }
  
      return updatedBill;
    } catch (error) {
      throw new Error(`Failed to update bill: ${error.message}`,error.status);
    }
  }
}
