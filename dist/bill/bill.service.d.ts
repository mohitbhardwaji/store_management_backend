import { Bill } from '../schemas/bill.schema';
import { Model } from 'mongoose';
export declare class BillService {
    private billModel;
    constructor(billModel: Model<Bill>);
    createBill(body: any): Promise<any>;
    getBillsByUser(query: any): Promise<{
        bills: any;
        total: any;
        currentPage: number;
        totalPages: number;
    }>;
    getBillById(billId: string): Promise<any>;
    updateBill(billId: any, body: Partial<Bill>): Promise<any>;
}
