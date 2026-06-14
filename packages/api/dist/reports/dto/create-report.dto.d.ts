import { ReportType } from '@nexus/shared';
export declare class CreateReportDto {
    name: string;
    type: ReportType;
    description?: string;
    dateRangeStart?: string;
    dateRangeEnd?: string;
    filters?: Record<string, any>;
}
