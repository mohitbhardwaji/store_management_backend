// src/bill/bill.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Bill } from '../schemas/bill.schema';
import mongoose, { Model } from 'mongoose';
import { CreateBillDto } from '../dto/bill.dto';
import { ObjectId } from 'bson';
@Injectable()
export class BillService {
  constructor(@InjectModel(Bill.name) private billModel: Model<Bill>) {}


  async createBill(body){
    const createdBill = new this.billModel(body);
    return createdBill.save();
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
  
  
  async getBillById(billId: string) {
    try {
      console.log("got api call",billId)
      if (!billId) {
        throw new Error('Bill id is undefined');
      }
      const bill = await this.billModel.findOne({ _id: billId });
      console.log({bill})
      if (!bill) {
        throw new Error('Bill not found or access denied');
      }
    
      return bill;
    } catch (error) {
      throw new BadRequestException(error.message)
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
