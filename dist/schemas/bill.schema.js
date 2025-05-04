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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillSchema = exports.Bill = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Bill = class Bill {
    formType;
    customerName;
    customerAddress;
    customerPhone;
    customerAltPhone;
    products;
    totalAmount;
    paymentMethod;
    transactionId;
    deliveryDate;
    salesperson;
    partialPayment;
    advanceAmount;
    splitPayment;
    payment1;
    payment2;
};
exports.Bill = Bill;
__decorate([
    (0, mongoose_1.Prop)({ default: 'Order Form' }),
    __metadata("design:type", String)
], Bill.prototype, "formType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Bill.prototype, "customerName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Bill.prototype, "customerAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Bill.prototype, "customerPhone", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Bill.prototype, "customerAltPhone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [
            {
                productNumber: { type: String, required: true },
                productName: { type: String },
                product_group: { type: String },
                gst: { type: Number },
                quantity: { type: Number, required: true, default: 1 },
                price: { type: Number, required: true, default: 0 },
                customPrice: { type: Number, required: true, default: 0 },
                image: { type: String },
                description: { type: String },
            },
        ] }),
    __metadata("design:type", Array)
], Bill.prototype, "products", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Bill.prototype, "totalAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Bill.prototype, "paymentMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Bill.prototype, "transactionId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Bill.prototype, "deliveryDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Bill.prototype, "salesperson", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Bill.prototype, "partialPayment", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Bill.prototype, "advanceAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Bill.prototype, "splitPayment", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            mode: { type: String },
            amount: { type: Number },
            transactionId: { type: String },
        },
        default: null,
    }),
    __metadata("design:type", Object)
], Bill.prototype, "payment1", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            mode: { type: String },
            amount: { type: Number },
            transactionId: { type: String },
        },
        default: null,
    }),
    __metadata("design:type", Object)
], Bill.prototype, "payment2", void 0);
exports.Bill = Bill = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Bill);
exports.BillSchema = mongoose_1.SchemaFactory.createForClass(Bill);
//# sourceMappingURL=bill.schema.js.map