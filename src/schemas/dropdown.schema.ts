import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DropdownDocument = Dropdown & Document;
@Schema()
export class Dropdown {
@Prop({required:true, unique: true})
key:string;

@Prop({required:true})
value:string[]
};

export const Dropdownschema = SchemaFactory.createForClass(Dropdown);
