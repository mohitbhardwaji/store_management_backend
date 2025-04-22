import { Document } from 'mongoose';
export declare class SKU extends Document {
    skuCode: string;
    model_number: string;
    product_name?: string;
    product_description?: string;
    comppany?: string;
    quantity: number;
    batchNo?: string;
    warrenty?: number;
    warehouseLocation?: string;
    status: boolean;
    costPrice: number;
    sellingPrice: number;
    mrp?: number;
    discount?: number;
    vendor?: string;
}
export declare const SKUSchema: import("mongoose").Schema<SKU, import("mongoose").Model<SKU, any, any, any, Document<unknown, any, SKU> & SKU & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SKU, Document<unknown, {}, import("mongoose").FlatRecord<SKU>> & import("mongoose").FlatRecord<SKU> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
