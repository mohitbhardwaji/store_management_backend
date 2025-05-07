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
  } from '@nestjs/common';
  import { FinanceService } from './finance.service';
  import { CreateFinanceDto,UpdateFinanceDto } from '../dto/finance.dto';
  
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
  }
  