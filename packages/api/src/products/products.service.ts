import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(companyId: string, page = 1, limit = 10, category?: string, search?: string) {
    let query = this.supabase.getClient()
      .from('products')
      .select('*', { count: 'exact' })
      .eq('company_id', companyId);

    if (category) query = query.eq('category', category);
    if (search) query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%`);

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
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('company_id', companyId)
      .single();

    if (error || !data) throw new NotFoundException('Product not found');
    return data;
  }

  async findBySku(sku: string, companyId: string) {
    const { data, error } = await this.supabase.getClient()
      .from('products')
      .select('*')
      .eq('sku', sku)
      .eq('company_id', companyId)
      .single();

    if (error || !data) throw new NotFoundException('Product not found');
    return data;
  }

  async findByCategory(category: string, companyId: string) {
    const { data, error } = await this.supabase.getClient()
      .from('products')
      .select('*')
      .eq('category', category)
      .eq('company_id', companyId);

    if (error) throw new Error(error.message);
    return data;
  }

  async getLowStock(companyId: string) {
    const { data, error } = await this.supabase.getClient()
      .from('products')
      .select('*')
      .eq('company_id', companyId)
      .lt('stock', 10);

    if (error) throw new Error(error.message);
    return data;
  }

  async create(companyId: string, dto: CreateProductDto) {
    const { data, error } = await this.supabase.getClient()
      .from('products')
      .insert({ ...dto, company_id: companyId })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async update(id: string, companyId: string, dto: UpdateProductDto) {
    const { data, error } = await this.supabase.getClient()
      .from('products')
      .update(dto)
      .eq('id', id)
      .eq('company_id', companyId)
      .select()
      .single();

    if (error || !data) throw new NotFoundException('Product not found');
    return data;
  }

  async remove(id: string, companyId: string) {
    const { error } = await this.supabase.getClient()
      .from('products')
      .delete()
      .eq('id', id)
      .eq('company_id', companyId);

    if (error) throw new Error(error.message);
    return { message: 'Product deleted' };
  }

  async getStats(companyId: string) {
    const { data, error } = await this.supabase.getClient()
      .from('products')
      .select('status, stock')
      .eq('company_id', companyId);

    if (error) throw new Error(error.message);

    const total = data?.length || 0;
    const active = data?.filter(p => p.status === 'active').length || 0;
    const outOfStock = data?.filter(p => p.stock === 0).length || 0;
    const lowStock = data?.filter(p => p.stock > 0 && p.stock < 10).length || 0;

    return { total, active, outOfStock, lowStock };
  }

  async getCategories(companyId: string) {
    const { data, error } = await this.supabase.getClient()
      .from('products')
      .select('category')
      .eq('company_id', companyId);

    if (error) throw new Error(error.message);
    return [...new Set(data?.map(p => p.category))];
  }
}