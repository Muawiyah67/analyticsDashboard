import { SupabaseService } from '../supabase/supabase.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private readonly supabase;
    constructor(supabase: SupabaseService);
    findAll(companyId: string, page?: number, limit?: number, category?: string, search?: string): Promise<{
        data: any[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, companyId: string): Promise<any>;
    findBySku(sku: string, companyId: string): Promise<any>;
    findByCategory(category: string, companyId: string): Promise<any[]>;
    getLowStock(companyId: string): Promise<any[]>;
    create(companyId: string, dto: CreateProductDto): Promise<any>;
    update(id: string, companyId: string, dto: UpdateProductDto): Promise<any>;
    remove(id: string, companyId: string): Promise<{
        message: string;
    }>;
    getStats(companyId: string): Promise<{
        total: number;
        active: number;
        outOfStock: number;
        lowStock: number;
    }>;
    getCategories(companyId: string): Promise<any[]>;
}
