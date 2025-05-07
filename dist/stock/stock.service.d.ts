import { Model } from 'mongoose';
import { Stock, StockDocument } from '../schemas/stock.schema';
import { UpdateStockDto } from '../dto/stock.dto';
import { BillDocument } from 'src/schemas/bill.schema';
import { Product, ProductDocument } from 'src/schemas/product.schema';
export declare class StockService {
    private readonly productModel;
    private stockModel;
    private billModel;
    constructor(productModel: Model<ProductDocument>, stockModel: Model<StockDocument>, billModel: Model<BillDocument>);
    searchStocks(searchQuery: string): Promise<(import("mongoose").Document<unknown, {}, ProductDocument, {}> & Product & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    updateStock(id: string, updateStockDto: UpdateStockDto): Promise<import("mongoose").Document<unknown, {}, StockDocument, {}> & Stock & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    parseDate(input: any): Promise<Date | null>;
    importStock(filePath: string, filter: {
        stock_date: string;
    }): Promise<{
        message: string;
        inserted: number;
        newProducts: string[];
        skippedDuplicates: any[];
        invalidRows: any[];
    }>;
}
