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
exports.StockService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const stock_schema_1 = require("../schemas/stock.schema");
const XLSX = require("xlsx");
const fs = require("fs");
const bill_schema_1 = require("../schemas/bill.schema");
const product_schema_1 = require("../schemas/product.schema");
let StockService = class StockService {
    productModel;
    stockModel;
    billModel;
    constructor(productModel, stockModel, billModel) {
        this.productModel = productModel;
        this.stockModel = stockModel;
        this.billModel = billModel;
    }
    async searchStocks(searchQuery) {
        try {
            let query = {};
            if (searchQuery) {
                query = {
                    productNumber: { $regex: searchQuery, $options: 'i' },
                };
            }
            const res = await this.productModel.find(query);
            return res;
        }
        catch (err) {
            throw new common_1.BadRequestException(err.message);
        }
    }
    async updateStock(id, updateStockDto) {
        const updatedStock = await this.stockModel.findByIdAndUpdate(id, updateStockDto, { new: true });
        if (!updatedStock) {
            throw new Error('Product not found');
        }
        return updatedStock;
    }
    async parseDate(input) {
        const date = new Date(input);
        return isNaN(date.getTime()) ? null : date;
    }
    async importStock(filePath, filter) {
        try {
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            const headers = rows[0];
            const dataRows = rows.slice(1);
            const stockInDate = new Date(filter.stock_date);
            const stocksToInsert = [];
            const newlyCreatedProducts = [];
            const skippedDuplicates = [];
            const invalidRows = [];
            for (const rawRow of dataRows) {
                const [productNumberRaw, quantityRaw, rateRaw, gstRaw] = rawRow;
                const productNumber = productNumberRaw?.toString().trim();
                const quantity = Number(quantityRaw) || 0;
                const rate = Number(rateRaw) || 0;
                const gst = Number(gstRaw) || 0;
                if (!productNumber) {
                    invalidRows.push({ reason: 'Missing product number or invalid quantity', row: rawRow });
                    continue;
                }
                let product = await this.productModel.findOne({ productNumber });
                if (!product) {
                    try {
                        product = await this.productModel.create({
                            productNumber,
                            category: 'Default',
                            subcategory: 'Default',
                            rate,
                            gst,
                        });
                        newlyCreatedProducts.push(productNumber);
                    }
                    catch (err) {
                        invalidRows.push({ reason: 'Failed to create product', row: rawRow, error: err.message });
                        continue;
                    }
                }
                else {
                    await this.productModel.updateOne({ productNumber }, { $set: { rate, gst } });
                }
                const existingStock = await this.stockModel.findOne({
                    product_id: product._id,
                    current_stock_in_date: stockInDate,
                });
                if (existingStock) {
                    skippedDuplicates.push({ reason: 'Duplicate stock', row: rawRow });
                    continue;
                }
                const stockData = {
                    product_id: product.id.toString(),
                    current_quantity: quantity,
                    current_stock_in_date: stockInDate,
                    vendor: 'Default Vendor',
                    history: [
                        {
                            quantity,
                            stock_in_date: stockInDate,
                            updated_at: new Date(),
                        },
                    ],
                };
                stocksToInsert.push(stockData);
            }
            if (stocksToInsert.length === 0) {
                fs.unlinkSync(filePath);
                throw new common_1.BadRequestException('No valid stock records to insert.');
            }
            const result = await this.stockModel.insertMany(stocksToInsert);
            fs.unlinkSync(filePath);
            return {
                message: 'Stock import completed',
                inserted: result.length,
                newProducts: newlyCreatedProducts,
                skippedDuplicates,
                invalidRows,
            };
        }
        catch (error) {
            console.error('Import stock error:', error);
            throw new common_1.BadRequestException('Failed to import stock: ' + error.message);
        }
    }
};
exports.StockService = StockService;
exports.StockService = StockService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(1, (0, mongoose_1.InjectModel)(stock_schema_1.Stock.name)),
    __param(2, (0, mongoose_1.InjectModel)(bill_schema_1.Bill.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], StockService);
//# sourceMappingURL=stock.service.js.map