export declare class AddToCartDto {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}
export declare class UpdateCartDto {
    productId: string;
    quantity?: number;
    customPrice?: number;
}
