import { BadRequestException, Injectable } from '@nestjs/common';
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


  // async getStocks(id: string, searchQuery: string, page: number, limit: number) {
  //   if (id) {
  //     const product = await this.stockModel.findById(id);
  //     if (!product) {
  //       throw new Error('Product not found');
  //     }
  
  //     // Calculate soldUnits for this product from specific formTypes
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
  //       product,
  //       soldUnits,
  //       availableUnits: product.unit,
  //     };
  //   }
  
  //   // Normal search + pagination
  //   let query = {};
  //   if (searchQuery) {
  //     query = {
  //       productNumber: { $regex: searchQuery, $options: 'i' },
  //     };
  //   }
  
  //   const skip = (page - 1) * limit;
  
  //   const [stocks, total] = await Promise.all([
  //     this.stockModel.find(query).skip(skip).limit(limit).lean(),
  //     this.stockModel.countDocuments(query),
  //   ]);
  
  //   const productNumbers = stocks.map((s) => s.productNumber);
  
  //   // Only count sold units for Order Form and Invoice
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
  
  //   const soldMap = soldData.reduce((acc, item) => {
  //     acc[item._id] = item.totalSold;
  //     return acc;
  //   }, {} as Record<string, number>);
  
  //   const updatedStocks = stocks.map((stock) => ({
  //     ...stock,
  //     soldUnits: soldMap[stock.productNumber] || 0,
  //   }));
  
  //   return {
  //     stocks: updatedStocks,
  //     total,
  //     page,
  //     limit,
  //     totalPages: Math.ceil(total / limit),
  //   };
  // }
  
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

  async searchStocks(searchQuery: string){
    try{let query = {};
  
    if (searchQuery) {
      query = {
        productNumber: { $regex: searchQuery, $options: 'i' },
      };
    }

    const res = await this.productModel.find(query)

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
  


  async importStock(filePath: string, filter: { stock_date: string }) {
    try {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
      const headers = rows[0] as string[];
      const dataRows = rows.slice(1);
      const stockInDate = new Date(filter.stock_date);
  
      const stocksToInsert: {
        product_id: string;
        current_quantity: number;
        current_stock_in_date: Date;
        vendor: string;
        history: {
          quantity: number;
          stock_in_date: Date;
          updated_at: Date;
        }[];
      }[] = [];
  
      const newlyCreatedProducts: string[] = [];
      const skippedDuplicates: any[] = [];
      const invalidRows: any[] = [];
  
      for (const rawRow of dataRows) {
        const [productNumberRaw, quantityRaw, rateRaw, gstRaw] = rawRow as [unknown, unknown, unknown, unknown];
  
        const productNumber = productNumberRaw?.toString().trim();
        const quantity = Number(quantityRaw) || 0;
        const rate = Number(rateRaw) || 0;
        const gst = Number(gstRaw) || 0;
  
        // Collect invalid records
        if (!productNumber) {
          invalidRows.push({ reason: 'Missing product number or invalid quantity', row: rawRow });
          continue;
        }
  
        // Check if product exists or create
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
          } catch (err) {
            invalidRows.push({ reason: 'Failed to create product', row: rawRow, error: err.message });
            continue;
          }
        } else {
          // Update rate and gst
          await this.productModel.updateOne({ productNumber }, { $set: { rate, gst } });
        }
  
        // Check for duplicate stock
        const existingStock = await this.stockModel.findOne({
          product_id: product._id,
          current_stock_in_date: stockInDate,
        });
  
        if (existingStock) {
          skippedDuplicates.push({ reason: 'Duplicate stock', row: rawRow });
          continue;
        }
  
        // Prepare stock entry
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
  
      // No valid stock rows to insert
      if (stocksToInsert.length === 0) {
        fs.unlinkSync(filePath);
        throw new BadRequestException('No valid stock records to insert.');
      }
  
      // Insert stock entries
      const result = await this.stockModel.insertMany(stocksToInsert);
  
      // Remove file
      fs.unlinkSync(filePath);
  
      return {
        message: 'Stock import completed',
        inserted: result.length,
        newProducts: newlyCreatedProducts,
        skippedDuplicates,
        invalidRows,
      };
    } catch (error) {
      console.error('Import stock error:', error);
      throw new BadRequestException('Failed to import stock: ' + error.message);
    }
  }
  
  
}
