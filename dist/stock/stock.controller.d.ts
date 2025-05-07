import { StockService } from './stock.service';
import { UpdateStockDto } from '../dto/stock.dto';
export declare class StockController {
    private readonly stockService;
    constructor(stockService: StockService);
    addStock(body: any): Promise<import("../schemas/stock.schema").Stock>;
    getStocks(searchQuery: string, page: number | undefined, limit: number | undefined, id: string): Promise<{
        product: any;
        soldUnits: any;
        availableUnits: any;
        stocks?: undefined;
        total?: undefined;
        page?: undefined;
        limit?: undefined;
        totalPages?: undefined;
    } | {
        stocks: any;
        total: any;
        page: number;
        limit: number;
        totalPages: number;
        product?: undefined;
        soldUnits?: undefined;
        availableUnits?: undefined;
    }>;
    searchStocks(searchQuery: string): Promise<any>;
    updateStock(id: string, updateStockDto: UpdateStockDto): Promise<any>;
    importStock(file: any, request: any): Promise<{
        message: string;
        totalImported: {
            productNumber: string;
            unit: number;
            unit_type: string;
            gst: number;
            mrp: number;
            offer_price: number;
            stock_in_date: Date;
        }[];
    }>;
}
