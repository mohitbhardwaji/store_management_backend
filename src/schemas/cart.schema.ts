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
}

export const CartSchema = SchemaFactory.createForClass(Cart);
