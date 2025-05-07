import { Document } from 'mongoose';
export type UserDocument = User & Document;
export declare class User {
    email: string;
    password: string;
    role: string;
}
export declare const UserSchema: any;
