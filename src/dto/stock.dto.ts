import {
    IsString,
    IsNumber,
    IsOptional,
    IsDateString,
    IsArray,
  } from 'class-validator';
  
  export class CreateStockDto {
    @IsString()
    productNumber: string;
  
    @IsString()
    product_group: string;
  
    @IsNumber()
    unit: number;
  
    @IsString()
    unit_type: string;
  
    @IsNumber()
    gst: number;
  
    @IsOptional()
    @IsString()
    batch?: string;
  
    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    image?:string;
  
    @IsOptional()
    @IsString()
    vendor?: string;
  
    @IsNumber()
    mrp: number;
  
    @IsNumber()
    offer_price: number;
  
    @IsNumber()
    selling_price: number;
  
    @IsNumber()
    cost_price: number;
  
    @IsDateString()
    stock_in_date: string;
  }
  

  export class CreateDropdownDto {
    @IsString()
    key: string;
  
    @IsArray()
    @IsString({ each: true })
    values: string[];
  }

  export class UpdateStockDto {
    @IsOptional()
    @IsString()
    productNumber?: string;
  
    @IsOptional()
    @IsString()
    product_group?: string;
  
    @IsOptional()
    @IsString()
    vendor?: string;
  
    @IsOptional()
    @IsNumber()
    mrp?: number;
  
    @IsOptional()
    @IsNumber()
    offer_price?: number;
  
    @IsOptional()
    @IsNumber()
    gst?: number;
  
  }