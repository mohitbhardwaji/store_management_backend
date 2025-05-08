import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateFinanceDto } from '../dto/finance.dto';

export class CreateBillDto {
  @IsString()
  @IsOptional()
  formType?: string;

  @IsString()
  customerName: string;

  @IsString()
  customerAddress: string;

  @IsString()
  customerPhone: string;

  @IsString()
  @IsOptional()
  customerAltPhone?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BillProductDto)
  products: BillProductDto[];

  @IsNumber()
  totalAmount: number;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  transactionId?: string;

  @IsDateString()
  @IsOptional()
  deliveryDate?: Date;

  @IsString()
  @IsOptional()
  salesperson?: string;

  @IsBoolean()
  @IsOptional()
  partialPayment?: boolean;

  @IsNumber()
  @IsOptional()
  advanceAmount?: number;

  @IsBoolean()
  @IsOptional()
  splitPayment?: boolean;

  @IsBoolean()
  @IsOptional()
  isFinance?: boolean;

  @ValidateNested()
  @Type(() => CreateFinanceDto)
  @IsOptional()
  finance?: CreateFinanceDto;
}

class BillProductDto {
  @IsString()
  productNumber: string;

  @IsString()
  @IsOptional()
  productName?: string;

  @IsString()
  @IsOptional()
  product_group?: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsNumber()
  customPrice: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsNumber()
  gst?: number;
}
