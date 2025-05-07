import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stock, StockDocument } from '../schemas/stock.schema';
import { CreateStockDto, UpdateStockDto } from '../dto/stock.dto';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { Bill, BillDocument } from 'src/schemas/bill.schema';

@Injectable()
export class StockService {
  constructor(
    @InjectModel(Stock.name) private stockModel: Model<StockDocument>,
    @InjectModel(Bill.name) private billModel: Model<BillDocument>,
  ) { }

  async addStock(body): Promise<Stock> {
    const imageMap: Record<string, string> = {
      TV: 'https://dianora.in/wp-content/uploads/2024/10/24-normal-tv-best-price.png',
      Refrigerator: 'https://images.samsung.com/is/image/samsung/p6pim/in/rt34dg5a2bbxhl/gallery/in-top-mount-freezer-twin-cooling-plus-529471-rt34dg5a2bbxhl-544358003?$684_547_PNG$',
      'Air conditioner': 'https://sovpsl.com/wp-content/uploads/2015/11/air-conditioning.jpg',
      'Washing Machine': 'https://electronicparadise.in/cdn/shop/files/BoschSeries6FrontLoadWashingMachine_8kg_1400rpmWGA2341PIN.jpg?v=1707300822',
      Fan: 'https://orientelectric.com/cdn/shop/files/Image_0-copy-0_6ca477d7-3f53-470f-a07c-9eb5a68eb758.png?v=1732165732&width=1946',
      Cooler: 'https://havells.com/media/catalog/product/cache/844a913d283fe95e56e39582c5f2767b/g/h/ghracdwe3451_3_.jpg',
      Microwave: 'https://blendart.in/wp-content/uploads/2024/08/Commercial-Microwave.webp',
    };

    // Check and process category
    const { category, ...rest } = body;

    if (category && imageMap[category]) {
      rest.image = imageMap[category];
    }

    const createdStock = new this.stockModel(rest);
    return await createdStock.save();
  }

  async getStocks(id: string, searchQuery: string, page: number, limit: number) {
    if (id) {
      const product = await this.stockModel.findById(id);
      if (!product) {
        throw new Error('Product not found');
      }
  
      // Calculate soldUnits for this product from specific formTypes
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
  
    // Normal search + pagination
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
  
    // Only count sold units for Order Form and Invoice
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
    }, {} as Record<string, number>);
  
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
  

  async searchStocks(searchQuery: string){
    try{let query = {};
  
    if (searchQuery) {
      query = {
        productNumber: { $regex: searchQuery, $options: 'i' },
      };
    }

    const res = await this.stockModel.find(query)

    return res
  }catch(err){
    throw new BadRequestException(err.message);
  } 
  
  }
  
  async updateStock(id: string, updateStockDto: UpdateStockDto) {
    const updatedStock = await this.stockModel.findByIdAndUpdate(
      id,
      updateStockDto,
      { new: true },
    );

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
      console.log(new Date(filter.stock_date))
      const dataRows = rows.slice(1); 

      let stocks: {
        productNumber: string;
        unit: number;
        unit_type: string;
        gst: number;
        mrp: number;
        offer_price: number;
        stock_in_date:Date;
      }[] = [];

      for (const rawRow of dataRows) {
        const row = rawRow as any[];
        const productNumber = row[0]?.toString().trim();
        const unitCell = row[1]?.toString().trim() || '';
        const price = row[2]?.toString().trim() ;
        if (!productNumber) {
          continue; // skip invalid rows
        }


        const stockItem = {
          productNumber,
          unit: unitCell != ''?unitCell:0,
          unit_type: "Nos.",
          gst: 18,
          mrp: price? price :  0,
          offer_price: price? price :  0,
          stock_in_date: new Date(filter.stock_date)
        };

        stocks.push(stockItem);
      }

      if (stocks.length === 0) {
        throw new BadRequestException('No valid data found in the file.');
      }

      // Save to database or do whatever you want
      const response = await this.stockModel.create(stocks);
      if (response) {

        return {
          message: 'Stock imported successfully',
          totalImported: stocks,
        };
      }

      // Delete file after processing
      fs.unlinkSync(filePath);

      return {
        message: 'Stock imported successfully',
        totalImported: stocks,
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to import stock: ' + error.message);
    }
  }


}
