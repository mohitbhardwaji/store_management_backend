// src/bill/bill.controller.ts
import { Controller, Post, Body, Req, UseGuards, Get, Param } from '@nestjs/common';
import { BillService } from './bill.service';
import { CreateBillDto } from '../dto/bill.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('bill')
export class BillController {
  constructor(private readonly billService: BillService) {}

  @Post()
  async createBill(@Body() dto: CreateBillDto, @Req() req: Request) {
    const user = req.user as any;
    return this.billService.createBill(user.userId, dto);
  }

  @Get()
  async getAllBills(@Req() req: Request) {
    const user = req.user as any;
    return this.billService.getBillsByUser(user.userId);
  }

  @Get(':id')
  async getBillById(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as any;
    return this.billService.getBillById(id, user.userId);
  }
}
