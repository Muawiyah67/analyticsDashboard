export declare class UpdateOrderDto {
    status?: string;
    shippingAddress?: string;
    notes?: string;
    items?: Array<{
        productId: string;
        quantity: number;
        price: number;
    }>;
}
