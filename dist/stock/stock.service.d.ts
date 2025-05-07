import { Model } from 'mongoose';
import { Stock, StockDocument } from '../schemas/stock.schema';
import { UpdateStockDto } from '../dto/stock.dto';
import { BillDocument } from 'src/schemas/bill.schema';
export declare class StockService {
    private stockModel;
    private billModel;
    constructor(stockModel: Model<StockDocument>, billModel: Model<BillDocument>);
    addStock(body: any): Promise<Stock>;
    getStocks(id: string, searchQuery: string, page: number, limit: number): Promise<{
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
    importStock(filePath: any, filter: any): Promise<{
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
