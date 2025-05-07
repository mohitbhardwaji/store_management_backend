import { Cart } from '../schemas/cart.schema';
import { Model } from 'mongoose';
import { AddToCartDto, UpdateCartDto } from '../dto/cart.dto';
export declare class CartService {
    private cartModel;
    constructor(cartModel: Model<Cart>);
    addToCart(userId: string, product: AddToCartDto): Promise<any>;
    getCartByUserId(userId: string): Promise<any>;
    removeProduct(userId: string, productId: string): Promise<any>;
    updateCartItem(userId: string, dto: UpdateCartDto): Promise<any>;
    deleteUserCart(userId: string): Promise<{
        message: string;
        deletedCount: number;
    }>;
}
