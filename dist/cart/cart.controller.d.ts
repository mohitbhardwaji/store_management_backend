import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartDto } from '../dto/cart.dto';
import { Request } from 'express';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    addToCart(dto: AddToCartDto, req: Request): Promise<import("mongoose").Document<unknown, {}, import("../schemas/cart.schema").Cart> & import("../schemas/cart.schema").Cart & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getUserCart(req: Request): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/cart.schema").Cart> & import("../schemas/cart.schema").Cart & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    removeFromCart(productId: string, req: Request): Promise<import("mongoose").Document<unknown, {}, import("../schemas/cart.schema").Cart> & import("../schemas/cart.schema").Cart & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateCart(dto: UpdateCartDto, req: Request): Promise<import("mongoose").Document<unknown, {}, import("../schemas/cart.schema").Cart> & import("../schemas/cart.schema").Cart & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    deleteUserCart(req: Request): Promise<{
        message: string;
        deletedCount: number;
    }>;
}
