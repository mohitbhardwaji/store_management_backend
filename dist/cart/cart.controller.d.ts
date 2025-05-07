import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartDto } from '../dto/cart.dto';
import { Request } from 'express';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    addToCart(dto: AddToCartDto, req: Request): Promise<any>;
    getUserCart(req: Request): Promise<any>;
    removeFromCart(productId: string, req: Request): Promise<any>;
    updateCart(dto: UpdateCartDto, req: Request): Promise<any>;
    deleteUserCart(req: Request): Promise<{
        message: string;
        deletedCount: any;
    }>;
}
