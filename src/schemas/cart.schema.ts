// src/cart/schemas/cart.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Cart extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop([
    {
      productId: String,
      name: String,
      price: Number,
      customPrice: Number,
      quantity: Number,
      image: String,
    },
  ])
  products: any[];

  @Prop({
    type: [
      {
        method: { type: String, required: true },
        amount: { type: Number, required: true },
        transaction_id: { type: String },
      },
    ],
  })
  payments: { method: string; amount: number; transaction_id?: string; }[];
  
}

export const CartSchema = SchemaFactory.createForClass(Cart);
