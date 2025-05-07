import { Bill } from '../schemas/bill.schema';
import mongoose, { Model } from 'mongoose';
export declare class BillService {
    private billModel;
    constructor(billModel: Model<Bill>);
    createBill(body: any): Promise<mongoose.Document<unknown, {}, Bill, {}> & Bill & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }>;
    getBillsByUser(query: any): Promise<{
        bills: (mongoose.Document<unknown, {}, Bill, {}> & Bill & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        })[];
        total: number;
        currentPage: number;
        totalPages: number;
    }>;
    getBillById(billId: string): Promise<mongoose.Document<unknown, {}, Bill, {}> & Bill & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateBill(billId: any, body: Partial<Bill>): Promise<mongoose.Document<unknown, {}, Bill, {}> & Bill & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }>;
}
