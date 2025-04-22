import { StockService } from './stock.service';
export declare class StockController {
    private readonly stockService;
    constructor(stockService: StockService);
    addStock(body: any): Promise<import("../schemas/stock.schema").Stock>;
    getStocks(searchQuery: string): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/stock.schema").StockDocument> & import("../schemas/stock.schema").Stock & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
}
