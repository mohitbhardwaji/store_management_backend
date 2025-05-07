
export class CreateBillDto {
    products: {
      productId: string;
      name: string;
      quantity: number;
      price: number;
      customPrice: number;
    }[];
    totalAmount: number;
  }
  