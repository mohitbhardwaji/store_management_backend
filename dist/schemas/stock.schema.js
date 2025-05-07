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
exports.StockSchema = exports.Stock = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Stock = class Stock {
    product_id;
    current_quantity;
    current_stock_in_date;
    history;
    vendor;
    created_at;
    updated_at;
    isDeleted;
};
exports.Stock = Stock;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Product', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Stock.prototype, "product_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Number)
], Stock.prototype, "current_quantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Stock.prototype, "current_stock_in_date", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                quantity: { type: Number, required: false },
                stock_in_date: { type: Date, required: false },
                updated_at: { type: Date, required: false },
            },
        ],
        default: [],
    }),
    __metadata("design:type", Array)
], Stock.prototype, "history", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Stock.prototype, "vendor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Stock.prototype, "created_at", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Stock.prototype, "updated_at", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Stock.prototype, "isDeleted", void 0);
exports.Stock = Stock = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Stock);
exports.StockSchema = mongoose_1.SchemaFactory.createForClass(Stock);
//# sourceMappingURL=stock.schema.js.map