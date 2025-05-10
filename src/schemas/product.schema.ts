import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, unique: true })
  productNumber: string;

  @Prop({ required: false })
  category?: string;

  @Prop({ required: false })
  subcategory?: string;

  @Prop({ required: false })
  rate?: number;

  @Prop({ required: false })
  cost_price?: number;

  @Prop({ required: false })
  gst?: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);



