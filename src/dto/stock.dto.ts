import {
    IsString,
    IsNumber,
    IsOptional,
    IsBoolean,
    IsDateString,
  } from 'class-validator';
  
  export class CreateStockDto {
    @IsString()
    product_name: string;
  
    @IsString()
    model_number: string;
  
    @IsString()
    company: string;
  
    @IsDateString()
    stock_in_date: string;
  
    @IsNumber()
    quantity: number;
  
    @IsOptional()
    @IsString()
    product_description?: string;
  
    @IsNumber()
    selling_price: number;
  
    @IsNumber()
    mrp: number;
  
    @IsNumber()
    cost_price: number;
  
    @IsOptional()
    @IsNumber()
    discount?: number;
  
    @IsOptional()
    @IsString()
    batch_no?: string;
  
    @IsOptional()
    @IsBoolean()
    status?: boolean;
  
    @IsOptional()
    @IsString()
    image_url?: string;
  }
  