import { SupabaseService } from '../supabase/supabase.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
export declare class OrdersService {
    private readonly supabase;
    constructor(supabase: SupabaseService);
    findAll(companyId: string, page?: number, limit?: number, status?: string, customerId?: string): Promise<{
        data: any[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, companyId: string): Promise<any>;
    create(companyId: string, dto: CreateOrderDto): Promise<any>;
    update(id: string, companyId: string, dto: UpdateOrderDto): Promise<any>;
    remove(id: string, companyId: string): Promise<{
        message: string;
    }>;
    getStats(companyId: string): Promise<{
        total: number;
        revenue: any;
        pending: number;
        completed: number;
    }>;
}
