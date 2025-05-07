import { Document } from 'mongoose';
export type BillDocument = Bill & Document;
export declare class Bill {
    formType: string;
    customerName: string;
    customerAddress: string;
    customerPhone: string;
    customerAltPhone?: string;
    products: {
        productNumber: string;
        productName: string;
        product_group?: string;
        quantity: number;
        price: number;
        customPrice: number;
        image?: string;
        description?: string;
    }[];
    totalAmount: number;
    paymentMethod?: string;
    transactionId?: string;
    deliveryDate?: Date;
    salesperson?: string;
    partialPayment: boolean;
    advanceAmount: number;
    splitPayment: boolean;
    payment1?: {
        mode?: string;
        amount?: number;
        transactionId?: string;
    };
    payment2?: {
        mode?: string;
        amount?: number;
        transactionId?: string;
    };
}
export declare const BillSchema: import("mongoose").Schema<Bill, import("mongoose").Model<Bill, any, any, any, Document<unknown, any, Bill, any> & Bill & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Bill, Document<unknown, {}, import("mongoose").FlatRecord<Bill>, {}> & import("mongoose").FlatRecord<Bill> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
