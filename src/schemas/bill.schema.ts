import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BillDocument = Bill & Document;

@Schema({ timestamps: true })
export class Bill {
  @Prop({ default: 'Order Form' })
  formType: string;

  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true })
  customerAddress: string;

  @Prop({ required: true })
  customerPhone: string;

  @Prop()
  customerAltPhone?: string;

  @Prop({ type: [
    {
      productNumber: { type: String, required: true },
      productName: { type: String },
      product_group: { type: String },
      gst: { type:Number },
      quantity: { type: Number, required: true, default: 1 },
      price: { type: Number, required: true, default: 0 },
      customPrice: { type: Number, required: true, default: 0 },
      image: { type: String },
      description: { type: String },
    },
  ] })
  products: {
    productNumber: string;
    productName: string;
    product_group?: string;
    quantity: number;
    price: number;
    customPrice: number;
    image?: string;
    description?: string;
  }[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop()
  paymentMethod?: string;

  @Prop()
  transactionId?: string;

  @Prop()
  deliveryDate?: Date;

  @Prop()
  salesperson?: string;

  @Prop({ default: false })
  partialPayment: boolean;

  @Prop({ default: 0 })
  advanceAmount: number;

  @Prop({ default: false })
  splitPayment: boolean;

  @Prop({
    type: {
      mode: { type: String },
      amount: { type: Number },
      transactionId: { type: String },
    },
    default: null,
  })
  payment1?: {
    mode?: string;
    amount?: number;
    transactionId?: string;
  };

  @Prop({
    type: {
      mode: { type: String },
      amount: { type: Number },
      transactionId: { type: String },
    },
    default: null,
  })
  payment2?: {
    mode?: string;
    amount?: number;
    transactionId?: string;
  };


}

export const BillSchema = SchemaFactory.createForClass(Bill);
