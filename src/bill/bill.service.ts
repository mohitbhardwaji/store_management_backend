// src/bill/bill.service.ts
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Bill } from '../schemas/bill.schema';
import mongoose, { isValidObjectId, Model } from 'mongoose';
import { CreateBillDto } from '../dto/bill.dto';
import { ObjectId } from 'bson';
import { Finance } from 'src/schemas/finance.schema';
@Injectable()
export class BillService {
  constructor(@InjectModel(Bill.name) private billModel: Model<Bill>,@InjectModel(Finance.name) private readonly financeModel: Model<Finance>) {}



  // async createBill(createBillDto: CreateBillDto) {

    
  //   const session = await this.billModel.db.startSession();
  //   session.startTransaction();
  
  //   try {
  //     const {
  //       isFinance,
  //       finance,
  //       products,
  //       ...billData
  //     } = createBillDto;
  
  //     // Create the bill
  //     const bill = new this.billModel({ ...billData, products });
  //     await bill.save({ session });
  
  //     if (isFinance && finance) {
  //       // Extract product_ids from the products array
  //       const productIds = products.map(p => p.product_id);
  
  //       const financeData = {
  //         ...finance,
  //         bill_id: bill._id,
  //         product_id: productIds,
  //       };
        
  //       const financeEntry = new this.financeModel(financeData);
  //       await financeEntry.save({ session });
  
  //       bill.finance_id = financeEntry._id as ObjectId;
  //       await bill.save({ session });
  //     }
  
  //     await session.commitTransaction();
  //     session.endSession();
  
  // //   return savedBill;
  //     return {
  //       message: 'Bill created successfully',
  //       billId: bill._id,
  //     };
  //   } catch (error) {
  //     await session.abortTransaction();
  //     session.endSession();
  //     console.error('Error creating bill with finance:', error);
  //     throw new BadRequestException('Failed to create bill: ' + error.message);
  //   }
  // }
  

  async createBill(createBillDto: CreateBillDto) {
    const session = await this.billModel.db.startSession();
    session.startTransaction();
  
    try {
      const {
        isFinance,
        finance,
        products,
        ...billData
      } = createBillDto;
  
      // Create the bill
      const bill = new this.billModel({ ...billData, products });
      await bill.save({ session });
  
      if (isFinance && finance) {
        // Extract product_ids from the products array
        const productIds = products.map(p => p.product_id);
  
        const financeData = {
          ...finance,
          bill_id: bill._id,
          product_id: productIds,
        };
  
        const financeEntry = new this.financeModel(financeData);
        await financeEntry.save({ session });
  
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
      const bill = await this.billModel.find().populate(['finance_id','finance_id.product_id']).lean();
  
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

  async getBills(page: number, limit: number, formType?: string,bill_id?: string) {
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};
    if (formType) {
      filter.formType = formType;
    }
    if (bill_id) {
      filter._id = bill_id;
    }

    try {
      const [bills, total] = await Promise.all([
        this.billModel
          .find(filter).populate(['finance_id','finance_id.product_id','salesperson'])
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        this.billModel.countDocuments(filter),
      ]);
      const totalBillsInspiteOfFormType = await this.billModel.countDocuments({});

      return {
        bills,
        totalBills: total,
        currentPage: page,
        pageSize: limit,
        totalPages: Math.ceil(total / limit),
        totalBillsInspiteOfFormType: totalBillsInspiteOfFormType,
      };
    } catch (error) {
      console.error('Error fetching bills:', error);
      throw new InternalServerErrorException('Failed to fetch bills');
    }
  }

  async updatePaidStatus(billId: string, isPaid: boolean) {
    if (!isValidObjectId(billId)) {
      throw new BadRequestException('Invalid bill ID format');
    }

    const bill = await this.billModel.findById(billId);
    if (!bill) {
      throw new NotFoundException(`Bill with ID ${billId} not found`);
    }

    bill.isPaid = isPaid;
    await bill.save();

    return {
      message: `Bill marked as ${isPaid ? 'paid' : 'unpaid'}`,
      billId: bill._id,
      isPaid: bill.isPaid,
    };
  }
}
