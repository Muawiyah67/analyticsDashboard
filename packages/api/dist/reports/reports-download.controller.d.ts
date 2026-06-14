import { Response } from 'express';
import { ReportsService } from './reports.service';
export declare class ReportsDownloadController {
    private reportsService;
    constructor(reportsService: ReportsService);
    downloadBySlug(slug: string, res: Response): Promise<void>;
}
