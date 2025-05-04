import { BillService } from './bill.service';
import { Request } from 'express';
export declare class BillController {
    private readonly billService;
    constructor(billService: BillService);
    createBill(body: any): Promise<import("mongoose").Document<unknown, {}, import("../schemas/bill.schema").Bill> & import("../schemas/bill.schema").Bill & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getAllBills(req: Request): Promise<{
        bills: (import("mongoose").Document<unknown, {}, import("../schemas/bill.schema").Bill> & import("../schemas/bill.schema").Bill & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        total: number;
        currentPage: number;
        totalPages: number;
    }>;
    getBillById(request: any): Promise<import("mongoose").Document<unknown, {}, import("../schemas/bill.schema").Bill> & import("../schemas/bill.schema").Bill & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateBill(request: any, body: any): Promise<import("mongoose").Document<unknown, {}, import("../schemas/bill.schema").Bill> & import("../schemas/bill.schema").Bill & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
}
