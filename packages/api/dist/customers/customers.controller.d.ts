import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customers.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
export declare class CustomersController {
    private customersService;
    constructor(customersService: CustomersService);
    findAll(page?: string, limit?: string, search?: string, status?: string): Promise<{
        data: any[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getStats(): Promise<{
        total: number;
        active: number;
        inactive: number;
        pending: number;
    }>;
    findOne(id: string): Promise<any>;
    create(dto: CreateCustomerDto): Promise<any>;
    update(id: string, dto: UpdateCustomerDto): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
