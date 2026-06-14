import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private productsService;
    constructor(productsService: ProductsService);
    findAll(companyId: string, page?: string, limit?: string, category?: string, search?: string): Promise<{
        data: any[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getStats(companyId: string): Promise<{
        total: number;
        active: number;
        outOfStock: number;
        lowStock: number;
    }>;
    getCategories(companyId: string): Promise<any[]>;
    getLowStock(companyId: string): Promise<any[]>;
    findOne(id: string, companyId: string): Promise<any>;
    findBySku(sku: string, companyId: string): Promise<any>;
    findByCategory(category: string, companyId: string): Promise<any[]>;
    create(dto: CreateProductDto, companyId: string): Promise<any>;
    update(id: string, dto: UpdateProductDto, companyId: string): Promise<any>;
    remove(id: string, companyId: string): Promise<{
        message: string;
    }>;
}
