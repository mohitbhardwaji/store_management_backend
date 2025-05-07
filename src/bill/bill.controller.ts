// src/bill/bill.controller.ts
import { Controller, Post, Body, Req, UseGuards, Get, Param, Patch } from '@nestjs/common';
import { BillService } from './bill.service';
import { CreateBillDto } from '../dto/bill.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('bill')
export class BillController {
  constructor(private readonly billService: BillService) {}

  @Post()
  async createBill(@Body() body) {
   return await this.billService.createBill(body)
  }

  @Get()
  async getAllBills(@Req() req: Request) {
    const filter = req.query;
    return this.billService.getBillsByUser(filter);
  }

  @Get('/id')
  async getBillById(@Req() request) {
    console.log(request)
    return this.billService.getBillById(request.query.id);
  }


  @Patch('update')
  async updateBill(@Req() request, @Body() body) {
    const filter  = request.query
    console.log({request})
    return this.billService.updateBill(filter, body);
  }
}
