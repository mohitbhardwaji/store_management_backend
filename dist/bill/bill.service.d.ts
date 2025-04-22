import { Bill } from '../schemas/bill.schema';
import { Model } from 'mongoose';
import { CreateBillDto } from '../dto/bill.dto';
export declare class BillService {
    private billModel;
    constructor(billModel: Model<Bill>);
    createBill(userId: string, dto: CreateBillDto): Promise<import("mongoose").Document<unknown, {}, Bill> & Bill & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getBillsByUser(userId: string): Promise<(import("mongoose").Document<unknown, {}, Bill> & Bill & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getBillById(billId: string, userId: string): Promise<import("mongoose").Document<unknown, {}, Bill> & Bill & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
