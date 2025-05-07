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
export declare const BillSchema: any;
