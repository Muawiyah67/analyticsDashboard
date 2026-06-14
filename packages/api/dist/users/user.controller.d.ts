import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(page?: string, limit?: string, search?: string, status?: string, role?: string): Promise<import("./user.service").PaginatedResponse<import("./entities/user.entity").UserEntity>>;
    getStats(): Promise<{
        totalUsers: number;
        activeUsers: number;
        inactiveUsers: number;
        suspended: number;
        admins: number;
    }>;
    findOne(id: string): Promise<import("./entities/user.entity").UserEntity | null>;
    create(createUserDto: CreateUserDto): Promise<import("./entities/user.entity").UserEntity>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("./entities/user.entity").UserEntity>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
    bulkDelete(ids: string[]): Promise<{
        success: boolean;
        count: number;
    }>;
    resetPassword(id: string, newPassword: string): Promise<{
        success: boolean;
    }>;
}
