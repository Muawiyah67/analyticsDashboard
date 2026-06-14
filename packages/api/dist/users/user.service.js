"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const shared_1 = require("@nexus/shared");
const supabase_service_1 = require("../supabase/supabase.service");
const user_entity_1 = require("./entities/user.entity");
let UsersService = class UsersService {
    constructor(supabase) {
        this.supabase = supabase;
    }
    async findAll(page = 1, limit = 10, search, status, role) {
        let query = this.supabase
            .getClient()
            .from('profiles')
            .select('*', { count: 'exact' });
        if (search) {
            query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%`);
        }
        if (status) {
            query = query.eq('status', status);
        }
        if (role) {
            query = query.eq('role', role);
        }
        const start = (page - 1) * limit;
        const { data, error, count } = await query.range(start, start + limit - 1);
        if (error)
            throw new Error(error.message);
        const usersData = (data || []).map((u) => this.mapUser(u));
        const total = count || 0;
        const totalPages = Math.ceil(total / limit);
        return {
            data: usersData,
            total,
            page,
            limit,
            totalPages,
        };
    }
    async findOne(id) {
        const { data, error } = await this.supabase
            .getClient()
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            if (error.code === 'PGRST116')
                return null;
            throw new Error(error.message);
        }
        return data ? this.mapUser(data) : null;
    }
    async create(createUserDto) {
        const { data, error } = await this.supabase
            .getClient()
            .from('profiles')
            .insert({
            name: createUserDto.name,
            role: createUserDto.role || shared_1.UserRole.USER,
            status: shared_1.UserStatus.ACTIVE,
            created_at: new Date().toISOString(),
        })
            .select()
            .single();
        if (error)
            throw new Error(error.message);
        return this.mapUser(data);
    }
    async update(id, updateUserDto) {
        const updateData = {};
        if (updateUserDto.name !== undefined)
            updateData.name = updateUserDto.name;
        if (updateUserDto.role !== undefined)
            updateData.role = updateUserDto.role;
        if (updateUserDto.status !== undefined)
            updateData.status = updateUserDto.status;
        const { data, error } = await this.supabase
            .getClient()
            .from('profiles')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw new Error(error.message);
        return this.mapUser(data);
    }
    async remove(id) {
        const { error } = await this.supabase
            .getClient()
            .from('profiles')
            .delete()
            .eq('id', id);
        if (error)
            throw new Error(error.message);
        return { success: true };
    }
    async getStats() {
        const { data, error } = await this.supabase
            .getClient()
            .from('profiles')
            .select('role, status');
        if (error)
            throw new Error(error.message);
        const usersList = data || [];
        return {
            totalUsers: usersList.length,
            activeUsers: usersList.filter((u) => u.status === 'active').length,
            inactiveUsers: usersList.filter((u) => u.status === 'inactive').length,
            suspended: usersList.filter((u) => u.status === 'suspended').length,
            admins: usersList.filter((u) => u.role === 'admin').length,
        };
    }
    async bulkDelete(ids) {
        const { error } = await this.supabase
            .getClient()
            .from('profiles')
            .delete()
            .in('id', ids);
        if (error)
            throw new Error(error.message);
        return { success: true, count: ids.length };
    }
    async resetPassword(id, newPassword) {
        console.log('Reset password for user:', id);
        return { success: true };
    }
    mapUser(raw) {
        return new user_entity_1.UserEntity({
            id: raw.id,
            name: raw.name,
            email: raw.email || '',
            phone: raw.phone,
            role: raw.role,
            status: raw.status,
            avatar: raw.avatar,
            createdAt: new Date(raw.created_at),
            updatedAt: new Date(raw.updated_at),
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], UsersService);
