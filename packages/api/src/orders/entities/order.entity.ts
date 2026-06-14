export interface OrderItemEntity {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  total?: number;
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItemEntity[];
  total: number;
  status: string;
  shippingAddress: string;
  createdAt: Date;
  updatedAt: Date;
}
