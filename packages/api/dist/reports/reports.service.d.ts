import { SupabaseService } from '../supabase/supabase.service';
import { CreateReportDto } from './dto/create-report.dto';
export declare class ReportsService {
    private readonly supabase;
    constructor(supabase: SupabaseService);
    findAll(companyId: string, page?: number, limit?: number, type?: string, status?: string): Promise<{
        data: any[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, companyId: string): Promise<any>;
    findBySlug(slug: string): Promise<any>;
    create(companyId: string, dto: CreateReportDto): Promise<any>;
    remove(id: string, companyId: string): Promise<{
        message: string;
    }>;
    getPdfUrl(slug: string): Promise<string>;
    private generateSlug;
    private generatePdfContent;
    private generateCsvContent;
    private toCsv;
}
