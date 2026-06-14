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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
let ProductsService = class ProductsService {
    constructor(supabase) {
        this.supabase = supabase;
    }
    async findAll(companyId, page = 1, limit = 10, category, search) {
        let query = this.supabase.getClient()
            .from('products')
            .select('*', { count: 'exact' })
            .eq('company_id', companyId);
        if (category)
            query = query.eq('category', category);
        if (search)
            query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%`);
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
    async findOne(id, companyId) {
        const { data, error } = await this.supabase.getClient()
            .from('products')
            .select('*')
            .eq('id', id)
            .eq('company_id', companyId)
            .single();
        if (error || !data)
            throw new common_1.NotFoundException('Product not found');
        return data;
    }
    async findBySku(sku, companyId) {
        const { data, error } = await this.supabase.getClient()
            .from('products')
            .select('*')
            .eq('sku', sku)
            .eq('company_id', companyId)
            .single();
        if (error || !data)
            throw new common_1.NotFoundException('Product not found');
        return data;
    }
    async findByCategory(category, companyId) {
        const { data, error } = await this.supabase.getClient()
            .from('products')
            .select('*')
            .eq('category', category)
            .eq('company_id', companyId);
        if (error)
            throw new Error(error.message);
        return data;
    }
    async getLowStock(companyId) {
        const { data, error } = await this.supabase.getClient()
            .from('products')
            .select('*')
            .eq('company_id', companyId)
            .lt('stock', 10);
        if (error)
            throw new Error(error.message);
        return data;
    }
    async create(companyId, dto) {
        const { data, error } = await this.supabase.getClient()
            .from('products')
            .insert({ ...dto, company_id: companyId })
            .select()
            .single();
        if (error)
            throw new Error(error.message);
        return data;
    }
    async update(id, companyId, dto) {
        const { data, error } = await this.supabase.getClient()
            .from('products')
            .update(dto)
            .eq('id', id)
            .eq('company_id', companyId)
            .select()
            .single();
        if (error || !data)
            throw new common_1.NotFoundException('Product not found');
        return data;
    }
    async remove(id, companyId) {
        const { error } = await this.supabase.getClient()
            .from('products')
            .delete()
            .eq('id', id)
            .eq('company_id', companyId);
        if (error)
            throw new Error(error.message);
        return { message: 'Product deleted' };
    }
    async getStats(companyId) {
        const { data, error } = await this.supabase.getClient()
            .from('products')
            .select('status, stock')
            .eq('company_id', companyId);
        if (error)
            throw new Error(error.message);
        const total = data?.length || 0;
        const active = data?.filter(p => p.status === 'active').length || 0;
        const outOfStock = data?.filter(p => p.stock === 0).length || 0;
        const lowStock = data?.filter(p => p.stock > 0 && p.stock < 10).length || 0;
        return { total, active, outOfStock, lowStock };
    }
    async getCategories(companyId) {
        const { data, error } = await this.supabase.getClient()
            .from('products')
            .select('category')
            .eq('company_id', companyId);
        if (error)
            throw new Error(error.message);
        return [...new Set(data?.map(p => p.category))];
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], ProductsService);
