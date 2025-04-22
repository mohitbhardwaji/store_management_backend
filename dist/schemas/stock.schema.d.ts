import { Document } from 'mongoose';
export type StockDocument = Stock & Document;
export declare class Stock {
    product_name: string;
    model_number: string;
    company: string;
    stock_in_date: Date;
    quantity: number;
    product_description?: string;
    selling_price: number;
    mrp: number;
    cost_price: number;
    discount?: number;
    batch_no?: string;
    status: boolean;
    image_url?: string;
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
