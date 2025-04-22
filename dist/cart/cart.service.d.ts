import { Cart } from '../schemas/cart.schema';
import { Model } from 'mongoose';
import { AddToCartDto, UpdateCartDto } from '../dto/cart.dto';
export declare class CartService {
    private cartModel;
    constructor(cartModel: Model<Cart>);
    addToCart(userId: string, product: AddToCartDto): Promise<import("mongoose").Document<unknown, {}, Cart> & Cart & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getCartByUserId(userId: string): Promise<(import("mongoose").Document<unknown, {}, Cart> & Cart & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    removeProduct(userId: string, productId: string): Promise<import("mongoose").Document<unknown, {}, Cart> & Cart & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateCartItem(userId: string, dto: UpdateCartDto): Promise<import("mongoose").Document<unknown, {}, Cart> & Cart & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    deleteUserCart(userId: string): Promise<{
        message: string;
        deletedCount: number;
    }>;
}
