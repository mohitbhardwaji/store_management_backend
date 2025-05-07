"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const bill_schema_1 = require("../schemas/bill.schema");
const mongoose_2 = require("mongoose");
const bson_1 = require("bson");
let BillService = class BillService {
    billModel;
    constructor(billModel) {
        this.billModel = billModel;
    }
    async createBill(body) {
        const createdBill = new this.billModel(body);
        return createdBill.save();
    }
    async getBillsByUser(query) {
        try {
            const page = parseInt(query.page) || 1;
            const limit = parseInt(query.limit) || 10;
            const skip = (page - 1) * limit;
            let filter = {};
            if (query.formType && query.formType !== '' && query.formType !== 'Select All') {
                filter = {
                    formType: query.formType
                };
            }
            const [bills, total] = await Promise.all([
                this.billModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
                this.billModel.countDocuments(filter),
            ]);
            return {
                bills,
                total,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
            };
        }
        catch (err) {
            throw new Error(err.message);
        }
    }
    async getBillById(billId) {
        try {
            console.log("got api call", billId);
            if (!billId) {
                throw new Error('Bill id is undefined');
            }
            const bill = await this.billModel.findOne({ _id: billId });
            console.log({ bill });
            if (!bill) {
                throw new Error('Bill not found or access denied');
            }
            return bill;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async updateBill(billId, body) {
        try {
            console.log({ billId });
            const objectId = new bson_1.ObjectId(billId);
            const updatedBill = await this.billModel.findByIdAndUpdate({ _id: billId.id }, { $set: body }, { new: true });
            if (!updatedBill) {
                throw new Error('Bill not found');
            }
            return updatedBill;
        }
        catch (error) {
            throw new Error(`Failed to update bill: ${error.message}`, error.status);
        }
    }
};
exports.BillService = BillService;
exports.BillService = BillService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(bill_schema_1.Bill.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], BillService);
//# sourceMappingURL=bill.service.js.map