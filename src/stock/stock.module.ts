import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Stock, StockSchema } from '../schemas/stock.schema';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { Bill, BillSchema } from 'src/schemas/bill.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Stock.name, schema: StockSchema },
    { name: Bill.name, schema: BillSchema }
  ])],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}
