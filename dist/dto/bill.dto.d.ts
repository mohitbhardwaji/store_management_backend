export declare class CreateBillDto {
    products: {
        productId: string;
        name: string;
        quantity: number;
        price: number;
        customPrice: number;
        image: string;
    }[];
    totalAmount: number;
}
