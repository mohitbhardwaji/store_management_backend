import { Document, Types } from 'mongoose';
export declare class Bill extends Document {
    userId: Types.ObjectId;
    products: any[];
    totalAmount: number;
}
export declare const BillSchema: import("mongoose").Schema<Bill, import("mongoose").Model<Bill, any, any, any, Document<unknown, any, Bill> & Bill & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Bill, Document<unknown, {}, import("mongoose").FlatRecord<Bill>> & import("mongoose").FlatRecord<Bill> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
