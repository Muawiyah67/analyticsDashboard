import { SupabaseService } from '../supabase/supabase.service';
import { CreateCustomerDto } from './dto/create-customers.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
export declare class CustomersService {
    private readonly supabase;
    constructor(supabase: SupabaseService);
    findAll(page?: number, limit?: number, search?: string, status?: string): Promise<{
        data: any[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<any>;
    create(dto: CreateCustomerDto): Promise<any>;
    update(id: string, dto: UpdateCustomerDto): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
    getStats(): Promise<{
        total: number;
        active: number;
        inactive: number;
        pending: number;
    }>;
}
