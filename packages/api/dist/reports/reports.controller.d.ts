import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
export declare class ReportsController {
    private reportsService;
    constructor(reportsService: ReportsService);
    findAll(companyId: string, page?: string, limit?: string, type?: string, status?: string): Promise<{
        data: any[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, companyId: string): Promise<any>;
    create(dto: CreateReportDto, companyId: string): Promise<any>;
    remove(id: string, companyId: string): Promise<{
        message: string;
    }>;
}
