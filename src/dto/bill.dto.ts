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
import { PartialType } from '@nestjs/mapped-types';
class PaymentDto {
  @IsString()
  @IsOptional()
  mode?: string;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  transactionId?: string;
}
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

  @IsMongoId()
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

  @ValidateNested()
@Type(() => PaymentDto)
@IsOptional()
payment1?: PaymentDto;

@ValidateNested()
@Type(() => PaymentDto)
@IsOptional()
payment2?: PaymentDto;

@IsBoolean()
@IsOptional()
isPaid: boolean = false;
}

class BillProductDto {
  @IsOptional()
  @IsMongoId()
  product_id?: string;

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

export class UpdateBillDto extends PartialType(CreateBillDto) {}