import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SalesExecutiveDocument = SalesExecutive & Document;

@Schema({ timestamps: true })
export class SalesExecutive {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, unique: true })
  mobileNumber: string;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const SalesExecutiveSchema = SchemaFactory.createForClass(SalesExecutive);
