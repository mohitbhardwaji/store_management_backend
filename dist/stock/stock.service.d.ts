import { Model } from 'mongoose';
import { Stock, StockDocument } from '../schemas/stock.schema';
import { CreateStockDto } from '../dto/stock.dto';
export declare class StockService {
    private stockModel;
    constructor(stockModel: Model<StockDocument>);
    addStock(body: CreateStockDto): Promise<Stock>;
    getStocks(searchQuery: string): Promise<(import("mongoose").Document<unknown, {}, StockDocument> & Stock & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
}
