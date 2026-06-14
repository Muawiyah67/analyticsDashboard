import { ProductStatus } from './create-product.dto';
export declare class UpdateProductDto {
    sku?: string;
    name?: string;
    description?: string;
    category?: string;
    price?: number;
    cost?: number;
    stock?: number;
    lowStockThreshold?: number;
    images?: string[];
    status?: ProductStatus;
}
