import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockDto } from '../dto/stock.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post('/addStock')
  async addStock(@Body() body ) {
    return this.stockService.addStock(body);
  }

  @Get('/getstock')
  async getStocks(@Query('search') searchQuery: string) {
    return this.stockService.getStocks(searchQuery);
  }
  
}
