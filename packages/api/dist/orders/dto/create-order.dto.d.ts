export declare class CreateOrderDto {
    customerId: string;
    items: Array<{
        productId: string;
        quantity: number;
        price: number;
    }>;
    shippingAddress: string;
    status?: string;
}
