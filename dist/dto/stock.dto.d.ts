export declare class CreateStockDto {
    product_name: string;
    model_number: string;
    company: string;
    stock_in_date: string;
    quantity: number;
    product_description?: string;
    selling_price: number;
    mrp: number;
    cost_price: number;
    discount?: number;
    batch_no?: string;
    status?: boolean;
    image_url?: string;
}
