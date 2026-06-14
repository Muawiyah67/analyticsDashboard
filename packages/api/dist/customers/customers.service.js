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
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
let CustomersService = class CustomersService {
    constructor(supabase) {
        this.supabase = supabase;
    }
    async findAll(page = 1, limit = 10, search, status) {
        let query = this.supabase.getClient()
            .from('customers')
            .select('*', { count: 'exact' });
        if (search) {
            query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
        }
        if (status) {
            query = query.eq('status', status);
        }
        const { data, error, count } = await query
            .order('created_at', { ascending: false })
            .range((page - 1) * limit, page * limit - 1);
        if (error)
            throw new Error(error.message);
        return {
            data,
            meta: {
                total: count || 0,
                page,
                limit,
                totalPages: Math.ceil((count || 0) / limit),
            },
        };
    }
    async findOne(id) {
        const { data, error } = await this.supabase.getClient()
            .from('customers')
            .select('*')
            .eq('id', id)
            .single();
        if (error || !data)
            throw new common_1.NotFoundException('Customer not found');
        return data;
    }
    async create(dto) {
        const { data, error } = await this.supabase.getClient()
            .from('customers')
            .insert(dto)
            .select()
            .single();
        if (error)
            throw new Error(error.message);
        return data;
    }
    async update(id, dto) {
        const { data, error } = await this.supabase.getClient()
            .from('customers')
            .update(dto)
            .eq('id', id)
            .select()
            .single();
        if (error || !data)
            throw new common_1.NotFoundException('Customer not found');
        return data;
    }
    async remove(id) {
        const { error } = await this.supabase.getClient()
            .from('customers')
            .delete()
            .eq('id', id);
        if (error)
            throw new Error(error.message);
        return { message: 'Customer deleted' };
    }
    async getStats() {
        const { data, error } = await this.supabase.getClient()
            .from('customers')
            .select('status');
        if (error)
            throw new Error(error.message);
        const total = data?.length || 0;
        const active = data?.filter(c => c.status === 'active').length || 0;
        const inactive = data?.filter(c => c.status === 'inactive').length || 0;
        const pending = data?.filter(c => c.status === 'pending').length || 0;
        return { total, active, inactive, pending };
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], CustomersService);
