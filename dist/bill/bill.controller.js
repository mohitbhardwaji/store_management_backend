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
exports.BillController = void 0;
const common_1 = require("@nestjs/common");
const bill_service_1 = require("./bill.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const express_1 = require("express");
let BillController = class BillController {
    billService;
    constructor(billService) {
        this.billService = billService;
    }
    async createBill(body) {
        return await this.billService.createBill(body);
    }
    async getAllBills(req) {
        const filter = req.query;
        return this.billService.getBillsByUser(filter);
    }
    async getBillById(request) {
        console.log(request);
        return this.billService.getBillById(request.query.id);
    }
    async updateBill(request, body) {
        const filter = request.query;
        console.log({ request });
        return this.billService.updateBill(filter, body);
    }
};
exports.BillController = BillController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BillController.prototype, "createBill", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], BillController.prototype, "getAllBills", null);
__decorate([
    (0, common_1.Get)('/id'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BillController.prototype, "getBillById", null);
__decorate([
    (0, common_1.Patch)('update'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BillController.prototype, "updateBill", null);
exports.BillController = BillController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('bill'),
    __metadata("design:paramtypes", [bill_service_1.BillService])
], BillController);
//# sourceMappingURL=bill.controller.js.map