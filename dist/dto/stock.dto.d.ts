export declare class CreateStockDto {
    productNumber: string;
    product_group: string;
    unit: number;
    unit_type: string;
    gst: number;
    batch?: string;
    description?: string;
    image?: string;
    vendor?: string;
    mrp: number;
    offer_price: number;
    selling_price: number;
    cost_price: number;
    stock_in_date: string;
}
export declare class CreateDropdownDto {
    key: string;
    values: string[];
}
export declare class UpdateStockDto {
    productNumber?: string;
    product_group?: string;
    vendor?: string;
    mrp?: number;
    offer_price?: number;
    gst?: number;
}
