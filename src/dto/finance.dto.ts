import { IsNotEmpty, IsNumber, IsPositive, IsMongoId, Min, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
export class CreateFinanceDto {
  @IsNotEmpty()
  financerName: string;

  @IsNumber()
  @Min(0)
  downpayment: number;

  @IsNumber()
  @Min(1)
  emiTenure: number;

  @IsNumber()
  @Min(0)
  roi: number;

  @IsNumber()
  @Min(0)
  discount: number;

  @IsNumber()
  @Min(0)
  priceAfterFinance: number;

  @IsOptional()
  stock_id: string;

  @IsOptional()
  product_id: string;
}




export class UpdateFinanceDto extends PartialType(CreateFinanceDto) {}