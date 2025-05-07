import { Document, Types } from 'mongoose';
export type StockDocument = Stock & Document;
export declare class Stock {
    product_id: Types.ObjectId;
    current_quantity: number;
    current_stock_in_date: Date;
    history: {
        quantity: number;
        stock_in_date: Date;
        updated_at: Date;
    }[];
    vendor: string;
    created_at: Date;
    updated_at: Date;
    isDeleted: boolean;
}
export declare const StockSchema: import("mongoose").Schema<Stock, import("mongoose").Model<Stock, any, any, any, Document<unknown, any, Stock, any> & Stock & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Stock, Document<unknown, {}, import("mongoose").FlatRecord<Stock>, {}> & import("mongoose").FlatRecord<Stock> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
