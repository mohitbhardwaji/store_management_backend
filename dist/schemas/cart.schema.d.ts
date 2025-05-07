import { Document, Types } from 'mongoose';
export declare class Cart extends Document {
    userId: Types.ObjectId;
    products: any[];
    payments: {
        method: string;
        amount: number;
        transaction_id?: string;
    }[];
}
export declare const CartSchema: any;
