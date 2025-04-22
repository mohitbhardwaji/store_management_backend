// src/bill/schemas/bill.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Bill extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop([
    {
      productId: String,
      name: String,
      quantity: Number,
      price: Number,
      customPrice: Number,
      image: String,
    },
  ])
  products: any[];

  @Prop()
  totalAmount: number;
}

export const BillSchema = SchemaFactory.createForClass(Bill);
