import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stock, StockDocument } from '../schemas/stock.schema';
import { CreateStockDto } from '../dto/stock.dto';

@Injectable()
export class StockService {
  constructor(
    @InjectModel(Stock.name) private stockModel: Model<StockDocument>,
  ) {}

  async addStock(body: CreateStockDto): Promise<Stock> {
    const createdStock = new this.stockModel(body);
    return await createdStock.save();
  }
  async getStocks(searchQuery: string) {
    let query = {};
  
    // If a search query is provided, modify the query to search by productName or modelNumber
    if (searchQuery) {
      query = {
        $or: [
          { product_name: { $regex: searchQuery, $options: 'i' } },
          { model_number: { $regex: searchQuery, $options: 'i' } },
        ],
      };
    }
  console.log({query})
    // Find stocks based on the search query
    const stocks = await this.stockModel.find(query);
    return stocks;
  }
  
}
