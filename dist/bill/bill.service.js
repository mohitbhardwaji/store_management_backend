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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const bill_schema_1 = require("../schemas/bill.schema");
const mongoose_2 = require("mongoose");
let BillService = class BillService {
    billModel;
    constructor(billModel) {
        this.billModel = billModel;
    }
    async createBill(userId, dto) {
        const bill = new this.billModel({
            userId,
            products: dto.products,
            totalAmount: dto.totalAmount,
        });
        return bill.save();
    }
    async getBillsByUser(userId) {
        return this.billModel.find({ userId }).sort({ createdAt: -1 });
    }
    async getBillById(billId, userId) {
        const bill = await this.billModel.findOne({ _id: billId, userId });
        if (!bill) {
            throw new Error('Bill not found or access denied');
        }
        return bill;
    }
};
exports.BillService = BillService;
exports.BillService = BillService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(bill_schema_1.Bill.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BillService);
//# sourceMappingURL=bill.service.js.map