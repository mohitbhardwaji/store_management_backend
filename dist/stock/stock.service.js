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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const stock_schema_1 = require("../schemas/stock.schema");
const XLSX = require("xlsx");
const fs = require("fs");
const bill_schema_1 = require("../schemas/bill.schema");
let StockService = class StockService {
    stockModel;
    billModel;
    constructor(stockModel, billModel) {
        this.stockModel = stockModel;
        this.billModel = billModel;
    }
    async addStock(body) {
        const imageMap = {
            TV: 'https://dianora.in/wp-content/uploads/2024/10/24-normal-tv-best-price.png',
            Refrigerator: 'https://images.samsung.com/is/image/samsung/p6pim/in/rt34dg5a2bbxhl/gallery/in-top-mount-freezer-twin-cooling-plus-529471-rt34dg5a2bbxhl-544358003?$684_547_PNG$',
            'Air conditioner': 'https://sovpsl.com/wp-content/uploads/2015/11/air-conditioning.jpg',
            'Washing Machine': 'https://electronicparadise.in/cdn/shop/files/BoschSeries6FrontLoadWashingMachine_8kg_1400rpmWGA2341PIN.jpg?v=1707300822',
            Fan: 'https://orientelectric.com/cdn/shop/files/Image_0-copy-0_6ca477d7-3f53-470f-a07c-9eb5a68eb758.png?v=1732165732&width=1946',
            Cooler: 'https://havells.com/media/catalog/product/cache/844a913d283fe95e56e39582c5f2767b/g/h/ghracdwe3451_3_.jpg',
            Microwave: 'https://blendart.in/wp-content/uploads/2024/08/Commercial-Microwave.webp',
        };
        const { category, ...rest } = body;
        if (category && imageMap[category]) {
            rest.image = imageMap[category];
        }
        const createdStock = new this.stockModel(rest);
        return await createdStock.save();
    }
    async getStocks(id, searchQuery, page, limit) {
        if (id) {
            const product = await this.stockModel.findById(id);
            if (!product) {
                throw new Error('Product not found');
            }
            const soldData = await this.billModel.aggregate([
                { $match: { formType: { $in: ['Order Form', 'Invoice'] } } },
                { $unwind: '$products' },
                { $match: { 'products.productNumber': product.productNumber } },
                {
                    $group: {
                        _id: '$products.productNumber',
                        totalSold: { $sum: '$products.quantity' },
                    },
                },
            ]);
            const soldUnits = soldData.length > 0 ? soldData[0].totalSold : 0;
            return {
                product,
                soldUnits,
                availableUnits: product.unit,
            };
        }
        let query = {};
        if (searchQuery) {
            query = {
                productNumber: { $regex: searchQuery, $options: 'i' },
            };
        }
        const skip = (page - 1) * limit;
        const [stocks, total] = await Promise.all([
            this.stockModel.find(query).skip(skip).limit(limit).lean(),
            this.stockModel.countDocuments(query),
        ]);
        const productNumbers = stocks.map((s) => s.productNumber);
        const soldData = await this.billModel.aggregate([
            { $match: { formType: { $in: ['Order Form', 'Invoice'] } } },
            { $unwind: '$products' },
            { $match: { 'products.productNumber': { $in: productNumbers } } },
            {
                $group: {
                    _id: '$products.productNumber',
                    totalSold: { $sum: '$products.quantity' },
                },
            },
        ]);
        const soldMap = soldData.reduce((acc, item) => {
            acc[item._id] = item.totalSold;
            return acc;
        }, {});
        const updatedStocks = stocks.map((stock) => ({
            ...stock,
            soldUnits: soldMap[stock.productNumber] || 0,
        }));
        return {
            stocks: updatedStocks,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async searchStocks(searchQuery) {
        try {
            let query = {};
            if (searchQuery) {
                query = {
                    productNumber: { $regex: searchQuery, $options: 'i' },
                };
            }
            const res = await this.stockModel.find(query);
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
    async importStock(filePath, filter) {
        try {
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            console.log(new Date(filter.stock_date));
            const dataRows = rows.slice(1);
            let stocks = [];
            for (const rawRow of dataRows) {
                const row = rawRow;
                const productNumber = row[0]?.toString().trim();
                const unitCell = row[1]?.toString().trim() || '';
                const price = row[2]?.toString().trim();
                if (!productNumber) {
                    continue;
                }
                const stockItem = {
                    productNumber,
                    unit: unitCell != '' ? unitCell : 0,
                    unit_type: "Nos.",
                    gst: 18,
                    mrp: price ? price : 0,
                    offer_price: price ? price : 0,
                    stock_in_date: new Date(filter.stock_date)
                };
                stocks.push(stockItem);
            }
            if (stocks.length === 0) {
                throw new common_1.BadRequestException('No valid data found in the file.');
            }
            const response = await this.stockModel.create(stocks);
            if (response) {
                return {
                    message: 'Stock imported successfully',
                    totalImported: stocks,
                };
            }
            fs.unlinkSync(filePath);
            return {
                message: 'Stock imported successfully',
                totalImported: stocks,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.BadRequestException('Failed to import stock: ' + error.message);
        }
    }
};
exports.StockService = StockService;
exports.StockService = StockService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(stock_schema_1.Stock.name)),
    __param(1, (0, mongoose_1.InjectModel)(bill_schema_1.Bill.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object])
], StockService);
//# sourceMappingURL=stock.service.js.map