// src/bill/bill.controller.ts
import { Controller, Post, Body, Req, UseGuards, Get, Param, Patch, UsePipes, ValidationPipe, BadRequestException } from '@nestjs/common';
import { BillService } from './bill.service';
import { CreateBillDto } from '../dto/bill.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

// @UseGuards(JwtAuthGuard)
@Controller('bill')
export class BillController {
  constructor(private readonly billService: BillService) {}

  @Post('create-bill')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createBill(@Body() createBillDto: CreateBillDto) {
    if (
      createBillDto.isFinance &&
      (!createBillDto.finance )
    ) {
      throw new BadRequestException(
        'Finance data is required when isFinance is true',
      );
    }

    return this.billService.createBill(createBillDto);
  }

  @Get('get-all-bill')
  async getAllBills(@Req() req: Request) {
    // const filter = req.query;
    return this.billService.getBillById();
  }

  // @Get('/id')
  // async getBillById(@Req() request) {
  //   console.log(request)
  //   return this.billService.getBillById(request.query.id);
  // }


  @Patch('update')
  async updateBill(@Req() request, @Body() body) {
    const filter  = request.query
    console.log({request})
    return this.billService.updateBill(filter, body);
  }
}
