import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Finance extends Document {
  @Prop({ required: true, trim: true })
  financerName: string;

  @Prop({ required: true, min: 0 })
  downpayment: number;

  @Prop({ required: true, min: 1 })
  emiTenure: number;

  @Prop({ required: true, min: 0 })
  roi: number;

  @Prop({ default: 0, min: 0 })
  discount: number;

  @Prop({ required: true, min: 0 })
  priceAfterFinance: number;

  @Prop({ type: Types.ObjectId, ref: 'Stock', required: true })
  stock_id: Types.ObjectId;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const FinanceSchema = SchemaFactory.createForClass(Finance);
