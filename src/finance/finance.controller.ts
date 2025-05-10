import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
    Query,
    UseGuards,
  } from '@nestjs/common';
  import { FinanceService } from './finance.service';
  import { CreateFinanceDto,UpdateFinanceDto } from '../dto/finance.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CalculateFinanceDto } from 'src/dto/calculate-finance.dto';
  // @UseGuards(JwtAuthGuard)
  @Controller('finance')
  export class FinanceController {
    constructor(private readonly financeService: FinanceService) {}
  
    @Post('create')
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createFinanceDto: CreateFinanceDto) {
      return this.financeService.create(createFinanceDto);
    }
  
    @Get('fetch_finance_details')
    findAll(@Query('finance_id') finance_id: string) {
      return this.financeService.findAll(finance_id);
    }
  
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateFinanceDto: UpdateFinanceDto) {
      return this.financeService.update(id, updateFinanceDto);
    }
  
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    softDelete(@Param('id') id: string) {
      return this.financeService.softDelete(id);
    }



  @Post('calculate')
  calculate(@Body() dto: CalculateFinanceDto) {
    return this.financeService.calculatePriceAfterFinance(dto);
  }
  }
  