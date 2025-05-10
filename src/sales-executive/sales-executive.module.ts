import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SalesExecutive, SalesExecutiveSchema } from '../schemas/sales-executive.schema';
import { SalesExecutiveService } from './sales-executive.service';
import { SalesExecutiveController } from './sales-executive.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SalesExecutive.name, schema: SalesExecutiveSchema },
    ]),
  ],
  controllers: [SalesExecutiveController],
  providers: [SalesExecutiveService],
  exports: [SalesExecutiveService]
})
export class SalesExecutiveModule {}
