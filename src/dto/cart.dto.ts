export class AddToCartDto {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }
  
  export class UpdateCartDto {
    productId: string;
    quantity?: number;
    customPrice?: number;
  }