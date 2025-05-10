import { IsNumber, Min } from 'class-validator';

export class CalculateFinanceDto {
  @IsNumber()
  @Min(0)
  product_rate: number;

  @IsNumber()
  @Min(0)
  downpayment: number;

  @IsNumber()
  @Min(1)
  emiTenure: number; // number of months

  @IsNumber()
  @Min(0)
  roi: number; // annual interest rate in percent

  @IsNumber()
  @Min(0)
  discount: number;
}
