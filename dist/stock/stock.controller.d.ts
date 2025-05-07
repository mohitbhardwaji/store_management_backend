import { StockService } from './stock.service';
import { UpdateStockDto } from '../dto/stock.dto';
export declare class StockController {
    private readonly stockService;
    constructor(stockService: StockService);
    searchStocks(searchQuery: string): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/product.schema").ProductDocument, {}> & import("../schemas/product.schema").Product & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    updateStock(id: string, updateStockDto: UpdateStockDto): Promise<import("mongoose").Document<unknown, {}, import("../schemas/stock.schema").StockDocument, {}> & import("../schemas/stock.schema").Stock & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    importStock(file: any, request: any): Promise<{
        message: string;
        inserted: number;
        newProducts: string[];
        skippedDuplicates: any[];
        invalidRows: any[];
    }>;
}
