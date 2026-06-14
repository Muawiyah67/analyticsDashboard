import { SupabaseService } from '../supabase/supabase.service';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export declare class UsersService {
    private readonly supabase;
    constructor(supabase: SupabaseService);
    findAll(page?: number, limit?: number, search?: string, status?: string, role?: string): Promise<PaginatedResponse<UserEntity>>;
    findOne(id: string): Promise<UserEntity | null>;
    create(createUserDto: CreateUserDto): Promise<UserEntity>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
    getStats(): Promise<{
        totalUsers: number;
        activeUsers: number;
        inactiveUsers: number;
        suspended: number;
        admins: number;
    }>;
    bulkDelete(ids: string[]): Promise<{
        success: boolean;
        count: number;
    }>;
    resetPassword(id: string, newPassword: string): Promise<{
        success: boolean;
    }>;
    private mapUser;
}
