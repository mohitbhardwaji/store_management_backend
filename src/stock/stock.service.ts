import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stock, StockDocument } from '../schemas/stock.schema';
import { CreateStockDto, UpdateStockDto } from '../dto/stock.dto';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { Bill, BillDocument } from 'src/schemas/bill.schema';
import { Product, ProductDocument } from 'src/schemas/product.schema';

@Injectable()
export class StockService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
    @InjectModel(Stock.name) private stockModel: Model<StockDocument>,
    @InjectModel(Bill.name) private billModel: Model<BillDocument>,
  ) { }


  // async getStock(stockId?: string) {
  //   if (stockId) {
  //     // ======== Get single stock by ID ========
  //     const stock = await this.stockModel.findById(stockId).lean();
  //     if (!stock) throw new NotFoundException('Stock not found');
  
  //     const product = await this.productModel.findById(stock.product_id).lean();
  //     if (!product) throw new NotFoundException('Product not found for stock');
  
  //     const soldData = await this.billModel.aggregate([
  //       { $match: { formType: { $in: ['Order Form', 'Invoice'] } } },
  //       { $unwind: '$products' },
  //       { $match: { 'products.productNumber': product.productNumber } },
  //       {
  //         $group: {
  //           _id: '$products.productNumber',
  //           totalSold: { $sum: '$products.quantity' },
  //         },
  //       },
  //     ]);
  
  //     const soldUnits = soldData.length > 0 ? soldData[0].totalSold : 0;
  
  //     return {
  //       stockId: stock._id,
  //       product,
  //       currentStock: stock.current_quantity,
  //       soldUnits,
  //       availableUnits: stock.current_quantity - soldUnits,
  //       stockHistory: stock.history,
  //       vendor: stock.vendor,
  //       updatedAt: stock.updated_at,
  //     };
  //   }
  
  //   // ======== Get ALL stocks ========
  //   const stocks = await this.stockModel.find().lean();
  
  //   const productIds = stocks.map((s) => s.product_id);
  //   const products = await this.productModel.find({ _id: { $in: productIds } }).lean();
  
  //   // Map productId -> product
  //   const productMap = new Map(products.map((p) => [p._id.toString(), p]));
  
  //   const productNumbers = products.map((p) => p.productNumber);
  
  //   const soldData = await this.billModel.aggregate([
  //     { $match: { formType: { $in: ['Order Form', 'Invoice'] } } },
  //     { $unwind: '$products' },
  //     { $match: { 'products.productNumber': { $in: productNumbers } } },
  //     {
  //       $group: {
  //         _id: '$products.productNumber',
  //         totalSold: { $sum: '$products.quantity' },
  //       },
  //     },
  //   ]);
  
  //   const soldMap = new Map(soldData.map((item) => [item._id, item.totalSold]));
  
  //   const result = stocks.map((stock) => {
  //     const product = productMap.get(stock.product_id.toString());
  //     const soldUnits = soldMap.get(product?.productNumber) || 0;
  
  //     return {
  //       stockId: stock._id,
  //       product,
  //       currentStock: stock.current_quantity,
  //       soldUnits,
  //       availableUnits: stock.current_quantity - soldUnits,
  //       stockHistory: stock.history,
  //       vendor: stock.vendor,
  //       updatedAt: stock.updated_at,
  //     };
  //   });
  
  //   return result;
  // }
  

  async getStock(stockId?: string, searchQuery?: string, page = 1, limit = 10) {
    console.log({ stockId, searchQuery, page, limit });
    
    if (stockId) {
      // ======== Get single stock by ID ========
      const stock = await this.stockModel.findById(stockId).lean();
      if (!stock) throw new NotFoundException('Stock not found');
  
      const product = await this.productModel.findById(stock.product_id).lean();
      if (!product) throw new NotFoundException('Product not found for stock');
  
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
        stockId: stock._id,
        product,
        currentStock: stock.current_quantity,
        soldUnits,
        availableUnits: stock.current_quantity - soldUnits,
        stockHistory: stock.history,
        vendor: stock.vendor,
        updatedAt: stock.updated_at,
      };
    }
  
    // ======== Get ALL stocks (with pagination and search) ========
  
    // 1. Find matching products first
    let productFilter: any = {};
    console.log({searchQuery});
    
    if (searchQuery) {
      productFilter.productNumber = { $regex: searchQuery, $options: 'i' };
    }
  
    const matchingProducts = await this.productModel.find(productFilter).lean();
    const matchingProductIds = matchingProducts.map((p) => p._id);
    const productMap = new Map(matchingProducts.map((p) => [p._id.toString(), p]));
    const productNumbers = matchingProducts.map((p) => p.productNumber);
  
    // 2. Pagination setup
    const skip = (page - 1) * limit;
  
    // 3. Get stocks for those products
    const [stocks, total] = await Promise.all([
      this.stockModel
        .find({ product_id: { $in: matchingProductIds } })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.stockModel.countDocuments({ product_id: { $in: matchingProductIds } }),
    ]);
  
    // 4. Get sold data
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
  
    const soldMap = new Map(soldData.map((item) => [item._id, item.totalSold]));
  
    // 5. Compose final result
    const result = stocks.map((stock) => {
      const product = productMap.get(stock.product_id.toString());
      const soldUnits = soldMap.get(product?.productNumber) || 0;
  
      return {
        stockId: stock._id,
        product,
        currentStock: stock.current_quantity,
        soldUnits,
        availableUnits: stock.current_quantity - soldUnits,
        stockHistory: stock.history,
        vendor: stock.vendor,
        updatedAt: stock.updated_at,
      };
    });
  
    return {
      data: result,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  
  
  //api for addding single stock by adding history and updating stock quantity
  //update ,softdelete,products

  // async createStock(createStockDto: CreateStockDto) {
  //   const { product_id, current_quantity, current_stock_in_date } = createStockDto;

  //   const stock = await this.stockModel.create({
  //     product_id,
  //     current_quantity,
  //     current_stock_in_date,
  //     vendor: 'Default Vendor',
  //     history: [
  //       {
  //         quantity: current_quantity,
  //         stock_in_date: current_stock_in_date,
  //         updated_at: new Date(),
  //       },
  //     ],
  //   });

  //   return stock;
  // }

  // async searchStocks(searchQuery: string){
  //   try{let query = {};
  
  //   if (searchQuery) {
  //     query = {
  //       productNumber: { $regex: searchQuery, $options: 'i' },
  //     };
  //   }

  //   const res = await this.productModel.find(query)

  //   return res
  // }catch(err){
  //   throw new BadRequestException(err.message);
  // } 
  
  // }




  async searchStocks(searchQuery: string) {
    try {
      const pipeline: any[] = [
        {
          $lookup: {
            from: 'products', // your actual collection name
            localField: 'product_id',
            foreignField: '_id',
            as: 'product',
          },
        },
        { $unwind: '$product' }, // Flatten the joined array
        {
          $match: {
            'product.productNumber': { $regex: searchQuery, $options: 'i' },
          },
        },
      ];
  
      const result = await this.stockModel.aggregate(pipeline);
      return result;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
  
  
  // async updateStock(id: string, updateStockDto: UpdateStockDto) {
  //   const updatedStock = await this.stockModel.findByIdAndUpdate(
  //     id,
  //     updateStockDto,
  //     { new: true },
  //   );

  //   if (!updatedStock) {
  //     throw new Error('Product not found');
  //   }

  //   return updatedStock;
  // }
  
  // async importStock(filePath, filter) {
  //   try {
  //     const workbook = XLSX.readFile(filePath);
  //     const sheetName = workbook.SheetNames[0];
  //     const worksheet = workbook.Sheets[sheetName];

  //     const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  //     console.log(new Date(filter.stock_date))
  //     const dataRows = rows.slice(1); 

  //     let stocks: {
  //       productNumber: string;
  //       unit: number;
  //       unit_type: string;
  //       gst: number;
  //       mrp: number;
  //       offer_price: number;
  //       stock_in_date:Date;
  //     }[] = [];

  //     for (const rawRow of dataRows) {
  //       const row = rawRow as any[];
  //       const productNumber = row[0]?.toString().trim();
  //       const unitCell = row[1]?.toString().trim() || '';
  //       const price = row[2]?.toString().trim() ;
  //       if (!productNumber) {
  //         continue; // skip invalid rows
  //       }


  //       const stockItem = {
  //         productNumber,
  //         unit: unitCell != ''?unitCell:0,
  //         unit_type: "Nos.",
  //         gst: 18,
  //         mrp: price? price :  0,
  //         offer_price: price? price :  0,
  //         stock_in_date: new Date(filter.stock_date)
  //       };

  //       stocks.push(stockItem);
  //     }

  //     if (stocks.length === 0) {
  //       throw new BadRequestException('No valid data found in the file.');
  //     }

  //     // Save to database or do whatever you want
  //     const response = await this.stockModel.create(stocks);
  //     if (response) {

  //       return {
  //         message: 'Stock imported successfully',
  //         totalImported: stocks,
  //       };
  //     }

  //     // Delete file after processing
  //     fs.unlinkSync(filePath);

  //     return {
  //       message: 'Stock imported successfully',
  //       totalImported: stocks,
  //     };
  //   } catch (error) {
  //     console.error(error);
  //     throw new BadRequestException('Failed to import stock: ' + error.message);
  //   }
  // }

  async parseDate(input: any){
    const date = new Date(input);
    return isNaN(date.getTime()) ? null : date;
  }
  

  // async importStock(filePath: string, filter: { stock_date: string }) {
  //   try {
  //     const workbook = XLSX.readFile(filePath);
  //     const sheetName = workbook.SheetNames[0];
  //     const worksheet = workbook.Sheets[sheetName];
  //     const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  //     const headers = rows[0] as string[];
  //     const dataRows = rows.slice(1);
  //     const stockInDate = new Date(filter.stock_date);
  
  //     const stocksToInsert: {
  //       product_id: string;
  //       current_quantity: number;
  //       current_stock_in_date: Date;
  //       vendor: string;
  //       history: {
  //         quantity: number;
  //         stock_in_date: Date;
  //         updated_at: Date;
  //       }[];
  //     }[] = [];
  
  //     const newlyCreatedProducts: string[] = [];
  //     const skippedDuplicates: string[] = [];
  
  //     for (const rawRow of dataRows) {
  //       const [productNumberRaw, quantityRaw, rateRaw, gstRaw] = rawRow as [unknown, unknown, unknown, unknown];
  
  //       const productNumber = productNumberRaw?.toString().trim();
  //       const quantity = Number(quantityRaw) || 0;
  //       const rate = Number(rateRaw) || 0;
  //       const gst = Number(gstRaw) || 0;
  
  //       if (!productNumber || quantity <= 0) continue;
  
  //       // Check if product already exists
  //       let product = await this.productModel.findOne({ productNumber });
  //       let wasCreated = false;
  
  //       if (!product) {
  //         // Create new product
  //         product = await this.productModel.create({
  //           productNumber,
  //           category: 'Default',
  //           subcategory: 'Default',
  //           rate,
  //           gst,
  //         });
  //         newlyCreatedProducts.push(productNumber);
  //         wasCreated = true;
  //       } else {
  //         // Update rate and gst if needed
  //         await this.productModel.findOneAndUpdate(
  //           { productNumber },
  //           {
  //             $set: { rate, gst },
  //           },
  //           { new: true }
  //         );
  //       }
  
  //       // Check for duplicate stock
  //       const existingStock = await this.stockModel.findOne({
  //         product_id: product._id,
  //         current_stock_in_date: stockInDate,
  //       });
  
  //       if (existingStock) {
  //         skippedDuplicates.push(productNumber);
  //         continue;
  //       }
  
  //       // Prepare new stock entry
  //       const stockData = {
  //         product_id: product._id as string,
  //         current_quantity: quantity,
  //         current_stock_in_date: stockInDate,
  //         vendor: 'Default Vendor',
  //         history: [
  //           {
  //             quantity,
  //             stock_in_date: stockInDate,
  //             updated_at: new Date(),
  //           },
  //         ],
  //       };
  
  //       stocksToInsert.push(stockData);
  //     }
  
  //     if (stocksToInsert.length === 0) {
  //       fs.unlinkSync(filePath);
  //       throw new BadRequestException('No valid new stock data found in the file.');
  //     }
  
  //     // Insert new stock data
  //     const result = await this.stockModel.insertMany(stocksToInsert);
  
  //     // Delete the file
  //     fs.unlinkSync(filePath);
  
  //     return {
  //       message: 'Stock import completed',
  //       inserted: result.length,
  //       newProducts: newlyCreatedProducts,
  //       skippedDuplicates,
  //     };
  //   } catch (error) {
  //     console.error('Import stock error:', error);
  //     throw new BadRequestException('Failed to import stock: ' + error.message);
  //   }
  // }
  


  // async importStock(filePath: string, filter: { stock_date: string }) {
  //   try {
  //     const workbook = XLSX.readFile(filePath);
  //     const sheetName = workbook.SheetNames[0];
  //     const worksheet = workbook.Sheets[sheetName];
  //     const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  //     const headers = rows[0] as string[];
  //     const dataRows = rows.slice(1);
  //     const stockInDate = new Date(filter.stock_date);
  
  //     const stocksToInsert: {
  //       product_id: string;
  //       current_quantity: number;
  //       current_stock_in_date: Date;
  //       vendor: string;
  //       history: {
  //         quantity: number;
  //         stock_in_date: Date;
  //         updated_at: Date;
  //       }[];
  //     }[] = [];
  
  //     const newlyCreatedProducts: string[] = [];
  //     const skippedDuplicates: any[] = [];
  //     const invalidRows: any[] = [];
  
  //     for (const rawRow of dataRows) {
  //       const [productNumberRaw, quantityRaw, rateRaw, gstRaw] = rawRow as [unknown, unknown, unknown, unknown];
  
  //       const productNumber = productNumberRaw?.toString().trim();
  //       const quantity = Number(quantityRaw) || 0;
  //       const rate = Number(rateRaw) || 0;
  //       const gst = Number(gstRaw) || 0;
  
  //       // Collect invalid records
  //       if (!productNumber) {
  //         invalidRows.push({ reason: 'Missing product number or invalid quantity', row: rawRow });
  //         continue;
  //       }
  
  //       // Check if product exists or create
  //       let product = await this.productModel.findOne({ productNumber });
  
  //       if (!product) {
  //         try {
  //           product = await this.productModel.create({
  //             productNumber,
  //             category: 'Default',
  //             subcategory: 'Default',
  //             rate,
  //             gst,
  //           });
  //           newlyCreatedProducts.push(productNumber);
  //         } catch (err) {
  //           invalidRows.push({ reason: 'Failed to create product', row: rawRow, error: err.message });
  //           continue;
  //         }
  //       } else {
  //         // Update rate and gst
  //         await this.productModel.updateOne({ productNumber }, { $set: { rate, gst } });
  //       }
  
  //       // Check for duplicate stock
  //       const existingStock = await this.stockModel.findOne({
  //         product_id: product._id,
  //         current_stock_in_date: stockInDate,
  //       });
  
  //       if (existingStock) {
  //         skippedDuplicates.push({ reason: 'Duplicate stock', row: rawRow });
  //         continue;
  //       }
  
  //       // Prepare stock entry
  //       const stockData = {
  //         product_id: product.id.toString(),
  //         current_quantity: quantity,
  //         current_stock_in_date: stockInDate,
  //         vendor: 'Default Vendor',
  //         history: [
  //           {
  //             quantity,
  //             stock_in_date: stockInDate,
  //             updated_at: new Date(),
  //           },
  //         ],
  //       };
  
  //       stocksToInsert.push(stockData);
  //     }
  
  //     // No valid stock rows to insert
  //     if (stocksToInsert.length === 0) {
  //       fs.unlinkSync(filePath);
  //       throw new BadRequestException('No valid stock records to insert.');
  //     }
  
  //     // Insert stock entries
  //     const result = await this.stockModel.insertMany(stocksToInsert);
  
  //     // Remove file
  //     fs.unlinkSync(filePath);
  
  //     return {
  //       message: 'Stock import completed',
  //       inserted: result.length,
  //       newProducts: newlyCreatedProducts,
  //       skippedDuplicates,
  //       invalidRows,
  //     };
  //   } catch (error) {
  //     console.error('Import stock error:', error);
  //     throw new BadRequestException('Failed to import stock: ' + error.message);
  //   }
  // }
  


  async importStock(filePath: string, filter: { stock_date: string }) {
    try {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
      const dataRows = rows.slice(1);
      const stockInDate = new Date(filter.stock_date);
  
      const newlyCreatedProducts: string[] = [];
      const updatedStocks: string[] = [];
      const insertedStocks: string[] = [];
      const invalidRows: any[] = [];
  
      for (const rawRow of dataRows) {
        const [productNumberRaw, quantityRaw, rateRaw,cost_price_raw, gstRaw] = rawRow as [unknown, unknown,unknown, unknown, unknown];
  
        const productNumber = productNumberRaw?.toString().trim();
        const quantity = isNaN(Number(quantityRaw)) ? 0 : Number(quantityRaw);
        const rate = isNaN(Number(rateRaw)) ? 0 : Number(rateRaw);
        const cost_price = isNaN(Number(cost_price_raw)) ? 0 : Number(cost_price_raw);
        const gst = isNaN(Number(gstRaw)) ? 0 : Number(gstRaw);
  
        if (!productNumber ) {
          invalidRows.push({ reason: 'Invalid product number or quantity', row: rawRow });
          continue;
        }
  
        // 1. Find or Create Product
        let product = await this.productModel.findOne({ productNumber });
        if (!product) {
          try {
            product = await this.productModel.create({
              productNumber,
              category: 'Default',
              subcategory: 'Default',
              rate,
              cost_price,
              gst,
            });
            newlyCreatedProducts.push(productNumber);
          } catch (err) {
            invalidRows.push({ reason: 'Failed to create product', row: rawRow, error: err.message });
            continue;
          }
        } else {
          await this.productModel.updateOne({ productNumber }, { $set: { rate, gst } });
        }
  
        // 2. Check for existing stock entry
        const existingStock = await this.stockModel.findOne({
          product_id: product._id,
        });
  
        if (existingStock) {
          // Update quantity and add to history
          await this.stockModel.updateOne(
            { _id: existingStock._id },
            {
              $inc: { current_quantity: quantity },
              $push: {
                history: {
                  quantity,
                  stock_in_date: stockInDate,
                  updated_at: new Date(),
                },
              },
              $set: { updated_at: new Date() },
            }
          );
          updatedStocks.push(productNumber);
        } else {
          // Insert new stock document
          await this.stockModel.create({
            product_id: product._id,
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
          });
          insertedStocks.push(productNumber);
        }
      }
  
      fs.unlinkSync(filePath);
  
      return {
        message: 'Stock import completed',
        newProducts: newlyCreatedProducts,
        insertedStocks,
        updatedStocks,
        invalidRows,
      };
    } catch (error) {
      console.error('Import stock error:', error);
      throw new BadRequestException('Failed to import stock: ' + error.message);
    }
  }
  

// src/stock/stock.service.ts
// src/stock/stock.service.ts
async updateStock(stockId: string, updateDto: UpdateStockDto) {
  const stock = await this.stockModel.findById(stockId);
  if (!stock) {
    throw new NotFoundException('Stock not found');
  }

  try {
    const now = new Date();

    if (updateDto.current_quantity !== undefined) {
      const stockInDate = updateDto.current_stock_in_date || now;

      // Push to history
      stock.history.push({
        quantity: updateDto.current_quantity,
        stock_in_date: typeof stockInDate === 'string' ? new Date(stockInDate) : stockInDate,
        updated_at: now,
      });

      // Increment current quantity
      stock.current_quantity += updateDto.current_quantity;

      // Always update current stock in date to now or provided one
      stock.current_stock_in_date = typeof stockInDate === 'string' ? new Date(stockInDate) : stockInDate;
    }

    if (updateDto.vendor !== undefined) {
      stock.vendor = updateDto.vendor;
    }

    if (updateDto.isDeleted !== undefined) {
      stock.isDeleted = updateDto.isDeleted;
    }

    stock.updated_at = now;
    return await stock.save();
  } catch (error) {
    console.error('Update failed:', error);
    throw new InternalServerErrorException('Failed to update stock');
  }
}


}
