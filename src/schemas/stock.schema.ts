import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StockDocument = Stock & Document;


@Schema({ timestamps: true })
export class Stock {
  @Prop({ required: true })
  productNumber: string;

  @Prop()
  product_group?: string;

  @Prop({ required: true })
  unit: number;

  @Prop({ required: true })
  unit_type: string;

  @Prop({ required: true })
  gst: number;

  @Prop()
  batch?: string;

  @Prop()
  description?: string;

  @Prop()
  image?: string;

  @Prop()
  vendor?: string;

  @Prop({ required: true })
  mrp: number;

  @Prop({ required: true })
  offer_price: number;

  @Prop()
  selling_price?: number;

  @Prop()
  cost_price?: number;

  @Prop({ required: true, type: Date })
  stock_in_date: Date;
}


export const StockSchema = SchemaFactory.createForClass(Stock);
