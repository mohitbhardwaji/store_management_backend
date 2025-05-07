import { BillService } from './bill.service';
import { Request } from 'express';
export declare class BillController {
    private readonly billService;
    constructor(billService: BillService);
    createBill(body: any): Promise<any>;
    getAllBills(req: Request): Promise<{
        bills: any;
        total: any;
        currentPage: number;
        totalPages: number;
    }>;
    getBillById(request: any): Promise<any>;
    updateBill(request: any, body: any): Promise<any>;
}
