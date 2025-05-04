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
export declare const StockSchema: import("mongoose").Schema<Stock, import("mongoose").Model<Stock, any, any, any, Document<unknown, any, Stock> & Stock & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Stock, Document<unknown, {}, import("mongoose").FlatRecord<Stock>> & import("mongoose").FlatRecord<Stock> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
