import { BillService } from './bill.service';
import { CreateBillDto } from '../dto/bill.dto';
import { Request } from 'express';
export declare class BillController {
    private readonly billService;
    constructor(billService: BillService);
    createBill(dto: CreateBillDto, req: Request): Promise<import("mongoose").Document<unknown, {}, import("../schemas/bill.schema").Bill> & import("../schemas/bill.schema").Bill & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getAllBills(req: Request): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/bill.schema").Bill> & import("../schemas/bill.schema").Bill & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getBillById(id: string, req: Request): Promise<import("mongoose").Document<unknown, {}, import("../schemas/bill.schema").Bill> & import("../schemas/bill.schema").Bill & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
