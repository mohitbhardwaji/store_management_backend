import { Document } from 'mongoose';
export type StockDocument = Stock & Document;
export declare class Stock {
    productNumber: string;
    product_group?: string;
    unit: number;
    unit_type: string;
    gst: number;
    batch?: string;
    description?: string;
    image?: string;
    vendor?: string;
    mrp: number;
    offer_price: number;
    selling_price?: number;
    cost_price?: number;
    stock_in_date: Date;
}
export declare const StockSchema: any;
