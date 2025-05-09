// src/bill/bill.module.ts
import { Module } from '@nestjs/common';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Bill, BillSchema } from '../schemas/bill.schema';
import { Finance, FinanceSchema } from 'src/schemas/finance.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Bill.name, schema: BillSchema }, { name: Finance.name, schema: FinanceSchema }])],
  controllers: [BillController],
  providers: [BillService],
})
export class BillModule {}
