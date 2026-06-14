import { OrdersService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
export declare class OrdersController {
    private ordersService;
    constructor(ordersService: OrdersService);
    findAll(companyId: string, page?: string, limit?: string, status?: string, customerId?: string): Promise<{
        data: any[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getStats(companyId: string): Promise<{
        total: number;
        revenue: any;
        pending: number;
        completed: number;
    }>;
    findOne(id: string, companyId: string): Promise<any>;
    create(dto: CreateOrderDto, companyId: string): Promise<any>;
    update(id: string, dto: UpdateOrderDto, companyId: string): Promise<any>;
    remove(id: string, companyId: string): Promise<{
        message: string;
    }>;
}
