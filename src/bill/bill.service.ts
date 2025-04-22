// src/bill/bill.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Bill } from '../schemas/bill.schema';
import { Model } from 'mongoose';
import { CreateBillDto } from '../dto/bill.dto';

@Injectable()
export class BillService {
  constructor(@InjectModel(Bill.name) private billModel: Model<Bill>) {}

  async createBill(userId: string, dto: CreateBillDto) {
    const bill = new this.billModel({
      userId,
      products: dto.products,
      totalAmount: dto.totalAmount,
    });
    return bill.save();
  }

  async getBillsByUser(userId: string) {
    return this.billModel.find({ userId }).sort({ createdAt: -1 });
  }
  
  async getBillById(billId: string, userId: string) {
    const bill = await this.billModel.findOne({ _id: billId, userId });
  
    if (!bill) {
      throw new Error('Bill not found or access denied');
    }
  
    return bill;
  }
}
