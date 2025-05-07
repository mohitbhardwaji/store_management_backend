import { Module } from '@nestjs/common';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Finance, FinanceSchema } from 'src/schemas/finance.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Finance.name, schema: FinanceSchema }])],
  controllers: [FinanceController],
  providers: [FinanceService]
})
export class FinanceModule {}
