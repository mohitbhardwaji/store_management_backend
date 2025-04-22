import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StockDocument = Stock & Document;

@Schema()
export class Stock {
  @Prop({ required: true })
  product_name: string;

  @Prop({ required: true })
  model_number: string;

  @Prop({ required: true })
  company: string;

  @Prop({ type: Date, required: true })
  stock_in_date: Date;

  @Prop({ required: true })
  quantity: number;

  @Prop()
  product_description?: string;

  @Prop()
  selling_price: number;

  @Prop({ required: true })
  mrp: number;

  @Prop({ required: true })
  cost_price: number;

  @Prop()
  discount?: number;

  @Prop()
  batch_no?: string;

  @Prop({ default: true })
  status: boolean;

  @Prop()
  image_url?: string; 
}

export const StockSchema = SchemaFactory.createForClass(Stock);
