import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(companyId: string, page = 1, limit = 10, status?: string, customerId?: string) {
    let query = this.supabase.getClient()
      .from('orders')
      .select('*, order_items(*)', { count: 'exact' })
      .eq('company_id', companyId);

    if (status) query = query.eq('status', status);
    if (customerId) query = query.eq('customer_id', customerId);

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw new Error(error.message);

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

  async findOne(id: string, companyId: string) {
    const { data, error } = await this.supabase.getClient()
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', id)
      .eq('company_id', companyId)
      .single();

    if (error || !data) throw new NotFoundException('Order not found');
    return data;
  }

  async create(companyId: string, dto: CreateOrderDto) {
    const { data: order, error: orderError } = await this.supabase.getClient()
      .from('orders')
      .insert({
        ...dto,
        company_id: companyId,
        order_number: `ORD-${Date.now()}`,
      })
      .select()
      .single();

    if (orderError) throw new Error(orderError.message);

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

  async update(id: string, companyId: string, dto: UpdateOrderDto) {
    const { data, error } = await this.supabase.getClient()
      .from('orders')
      .update(dto)
      .eq('id', id)
      .eq('company_id', companyId)
      .select()
      .single();

    if (error || !data) throw new NotFoundException('Order not found');
    return data;
  }

  async remove(id: string, companyId: string) {
    const { error } = await this.supabase.getClient()
      .from('orders')
      .delete()
      .eq('id', id)
      .eq('company_id', companyId);

    if (error) throw new Error(error.message);
    return { message: 'Order deleted' };
  }

  async getStats(companyId: string) {
    const { data, error } = await this.supabase.getClient()
      .from('orders')
      .select('status, total_amount')
      .eq('company_id', companyId);

    if (error) throw new Error(error.message);

    const total = data?.length || 0;
    const revenue = data?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;
    const pending = data?.filter(o => o.status === 'pending').length || 0;
    const completed = data?.filter(o => o.status === 'completed').length || 0;

    return { total, revenue, pending, completed };
  }
}