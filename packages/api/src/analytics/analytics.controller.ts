import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';

@ApiTags('Analytics')
@Controller('analytics')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseInterceptor)
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('stats')
  async getStats(@CurrentUser('company_id') companyId: string) {
    return this.analyticsService.getDashboardStats(companyId);
  }

  @Get('revenue')
  async getRevenue(
    @CurrentUser('company_id') companyId: string,
    @Query('period') period: string = 'month',
  ) {
    return this.analyticsService.getRevenueData(companyId, period);
  }

  @Get('traffic')
  async getTraffic(
    @CurrentUser('company_id') companyId: string,
    @Query('period') period: string = 'month',
  ) {
    return this.analyticsService.getTrafficData(companyId, period);
  }

  @Get('top-pages')
  async getTopPages(
    @CurrentUser('company_id') companyId: string,
    @Query('limit') limit: string = '5',
  ) {
    return this.analyticsService.getTopPages(companyId, parseInt(limit));
  }

  @Get('top-products')
  async getTopProducts(
    @CurrentUser('company_id') companyId: string,
    @Query('limit') limit: string = '5',
  ) {
    return this.analyticsService.getTopProducts(companyId, parseInt(limit));
  }

  @Get('dashboard')
  async getDashboard(@CurrentUser('company_id') companyId: string) {
    const [stats, revenue, topProducts] = await Promise.all([
      this.analyticsService.getDashboardStats(companyId),
      this.analyticsService.getRevenueData(companyId),
      this.analyticsService.getTopProducts(companyId),
    ]);

    return { stats, revenue, topProducts };
  }

  @Get('export')
  async export(
    @CurrentUser('company_id') companyId: string,
    @Query('format') format: string = 'csv',
  ) {
    return this.analyticsService.exportAnalytics(companyId, format);
  }
}