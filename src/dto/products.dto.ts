import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  readonly productNumber: string;

  @IsOptional()
  @IsString()
  readonly category?: string;

  @IsOptional()
  @IsString()
  readonly subcategory?: string;

  @IsOptional()
  @IsNumber()
  readonly rate?: number;

  @IsOptional()
  @IsNumber()
  readonly gst?: number;
}


export class UpdateProductDto {
    @IsOptional()
    @IsString()
    category?: string;
  
    @IsOptional()
    @IsString()
    subcategory?: string;
  
    @IsOptional()
    @IsNumber()
    rate?: number;
  
    @IsOptional()
    @IsNumber()
    gst?: number;
  }