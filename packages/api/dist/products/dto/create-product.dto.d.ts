export declare enum ProductStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    OUT_OF_STOCK = "out_of_stock",
    DISCONTINUED = "discontinued"
}
export declare class CreateProductDto {
    sku: string;
    name: string;
    description: string;
    category: string;
    price: number;
    cost?: number;
    stock: number;
    lowStockThreshold?: number;
    images?: string[];
    status?: ProductStatus;
}
