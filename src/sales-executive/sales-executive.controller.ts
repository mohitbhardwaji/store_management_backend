import { Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { CreateSalesExecutiveDto } from '../dto/create-sales-executive.dto';
import { SalesExecutiveService } from './sales-executive.service';

@Controller('sales-executives')
export class SalesExecutiveController {
  constructor(private readonly service: SalesExecutiveService) {}

  @Post()
  async create(@Body() dto: CreateSalesExecutiveDto) {
    return this.service.create(dto);
  }

  @Delete(':executiveId')
  async softDelete(@Param('executiveId') executiveId: string) {
    return this.service.softDelete(executiveId);
  }

  @Get()
  async getSalesExecutives(@Query('executiveId') executiveId?: string) {
    try {
      const result = await this.service.findAll(executiveId);
      return {
        success: true,
        data: result,
        message: executiveId ? 'Sales executive fetched successfully' : 'Sales executives list fetched successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch sales executive(s)');
    }
  }
}
