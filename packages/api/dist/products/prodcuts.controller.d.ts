import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private productsService;
    constructor(productsService: ProductsService);
    findAll(page?: string, limit?: string, minPrice?: string, maxPrice?: string, category?: string, status?: string): Promise<import("./products.service").PaginatedProductResponse>;
    getStats(): Promise<{
        totalProducts: number;
        activeProducts: number;
        inactiveProducts: number;
        totalStock: number;
        averagePrice: number;
    }>;
    getCategories(): Promise<string[]>;
    getLowStock(threshold?: string): Promise<import("./entities/product.entity").ProductEntity[]>;
    findOne(id: string): Promise<import("./entities/product.entity").ProductEntity | null>;
    findBySku(sku: string): Promise<import("./entities/product.entity").ProductEntity | null>;
    findByCategory(category: string): Promise<import("./entities/product.entity").ProductEntity[]>;
    create(createProductDto: CreateProductDto): Promise<import("./entities/product.entity").ProductEntity>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<import("./entities/product.entity").ProductEntity>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
    bulkUpdate(ids: string[], status: string): Promise<{
        success: boolean;
        count: number;
    }>;
    bulkDelete(ids: string[]): Promise<{
        success: boolean;
        count: number;
    }>;
}
