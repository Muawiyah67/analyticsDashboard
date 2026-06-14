import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  customerId: string;

  @IsArray()
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;

  @IsString()
  shippingAddress: string;

  @IsOptional()
  @IsString()
  status?: string;
}
