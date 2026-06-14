import { ProductStatus } from '@nexus/shared';
export declare class ProductEntity {
    id: string;
    sku: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    status: ProductStatus;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<ProductEntity>);
}
