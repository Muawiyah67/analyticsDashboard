import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateCustomerDto } from './dto/create-customers.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(page = 1, limit = 10, search?: string, status?: string) {
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

  async findOne(id: string) {
    const { data, error } = await this.supabase.getClient()
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundException('Customer not found');
    return data;
  }

  async create(dto: CreateCustomerDto) {
    const { data, error } = await this.supabase.getClient()
      .from('customers')
      .insert(dto)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async update(id: string, dto: UpdateCustomerDto) {
    const { data, error } = await this.supabase.getClient()
      .from('customers')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) throw new NotFoundException('Customer not found');
    return data;
  }

  async remove(id: string) {
    const { error } = await this.supabase.getClient()
      .from('customers')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return { message: 'Customer deleted' };
  }

  async getStats() {
    const { data, error } = await this.supabase.getClient()
      .from('customers')
      .select('status');

    if (error) throw new Error(error.message);

    const total = data?.length || 0;
    const active = data?.filter(c => c.status === 'active').length || 0;
    const inactive = data?.filter(c => c.status === 'inactive').length || 0;
    const pending = data?.filter(c => c.status === 'pending').length || 0;

    return { total, active, inactive, pending };
  }
}