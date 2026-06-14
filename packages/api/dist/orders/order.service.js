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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
let OrdersService = class OrdersService {
    constructor(supabase) {
        this.supabase = supabase;
    }
    async findAll(companyId, page = 1, limit = 10, status, customerId) {
        let query = this.supabase.getClient()
            .from('orders')
            .select('*, order_items(*)', { count: 'exact' })
            .eq('company_id', companyId);
        if (status)
            query = query.eq('status', status);
        if (customerId)
            query = query.eq('customer_id', customerId);
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
            .from('orders')
            .select('*, order_items(*)')
            .eq('id', id)
            .eq('company_id', companyId)
            .single();
        if (error || !data)
            throw new common_1.NotFoundException('Order not found');
        return data;
    }
    async create(companyId, dto) {
        const { data: order, error: orderError } = await this.supabase.getClient()
            .from('orders')
            .insert({
            ...dto,
            company_id: companyId,
            order_number: `ORD-${Date.now()}`,
        })
            .select()
            .single();
        if (orderError)
            throw new Error(orderError.message);
        if (dto.items?.length) {
            const items = dto.items.map(item => ({
                ...item,
                order_id: order.id,
                company_id: companyId,
            }));
            await this.supabase.getClient().from('order_items').insert(items);
        }
        return order;
    }
    async update(id, companyId, dto) {
        const { data, error } = await this.supabase.getClient()
            .from('orders')
            .update(dto)
            .eq('id', id)
            .eq('company_id', companyId)
            .select()
            .single();
        if (error || !data)
            throw new common_1.NotFoundException('Order not found');
        return data;
    }
    async remove(id, companyId) {
        const { error } = await this.supabase.getClient()
            .from('orders')
            .delete()
            .eq('id', id)
            .eq('company_id', companyId);
        if (error)
            throw new Error(error.message);
        return { message: 'Order deleted' };
    }
    async getStats(companyId) {
        const { data, error } = await this.supabase.getClient()
            .from('orders')
            .select('status, total_amount')
            .eq('company_id', companyId);
        if (error)
            throw new Error(error.message);
        const total = data?.length || 0;
        const revenue = data?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;
        const pending = data?.filter(o => o.status === 'pending').length || 0;
        const completed = data?.filter(o => o.status === 'completed').length || 0;
        return { total, revenue, pending, completed };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], OrdersService);
