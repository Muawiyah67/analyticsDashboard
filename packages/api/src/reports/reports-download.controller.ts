import { Controller, Get, Param, Res, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Reports')
@Controller('reports')
export class ReportsDownloadController {
  constructor(private reportsService: ReportsService) {}

  @Public()
  @Get('download/:slug')
  async downloadBySlug(
    @Param('slug') slug: string,
    @Res() res: Response,
  ) {
    try {
      const pdfUrl = await this.reportsService.getPdfUrl(slug);
      res.redirect(pdfUrl);
    } catch (err) {
      res.status(404).json({ message: 'Report not found' });
    }
  }
}