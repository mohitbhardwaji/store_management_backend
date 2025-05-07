// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';



// @Schema({ timestamps: true })
// export class Stock {
//   @Prop({ required: true })
//   productNumber: string;

//   @Prop()
//   product_group?: string;

//   @Prop({ required: true })
//   unit: number;

//   @Prop({ required: true })
//   unit_type: string;

//   @Prop({ required: true })
//   gst: number;

//   @Prop()
//   batch?: string;

//   @Prop()
//   description?: string;

//   @Prop()
//   image?: string;

//   @Prop()
//   vendor?: string;

//   @Prop({ required: true })
//   mrp: number;

//   @Prop({ required: true })
//   offer_price: number;

//   @Prop()
//   selling_price?: number;

//   @Prop()
//   cost_price?: number;

//   @Prop({ required: true, type: Date })
//   stock_in_date: Date;
// }


// export const StockSchema = SchemaFactory.createForClass(Stock);


import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type StockDocument = Stock & Document;

@Schema({ timestamps: true })
export class Stock  {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product_id: Types.ObjectId;

  @Prop({ required: false})
  current_quantity: number;

  @Prop({ default: Date.now })
  current_stock_in_date: Date;

  @Prop({
    type: [
      {
        quantity: { type: Number, required: false },
        stock_in_date: { type: Date, required: false },
        updated_at: { type: Date, required: false },
      },
    ],
    default: [],
  })
  history: { quantity: number; stock_in_date: Date; updated_at: Date }[];

  @Prop({ required: false })
  vendor: string;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const StockSchema = SchemaFactory.createForClass(Stock);
