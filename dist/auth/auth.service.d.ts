import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private userModel;
    private jwtService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService);
    register(email: string, password: string): Promise<any>;
    login(email: string, password: string): Promise<any>;
    getUser(userId: string): Promise<User | null>;
}
