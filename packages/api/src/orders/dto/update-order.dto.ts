import { IsOptional, IsString, IsArray } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  shippingAddress?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  items?: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}