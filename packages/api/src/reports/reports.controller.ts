import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';

@ApiTags('Reports')
@Controller('reports')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseInterceptor)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get()
  async findAll(
    @CurrentUser('company_id') companyId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('type') type?: string,
    @Query('status') status?: string,
  ) {
    return this.reportsService.findAll(
      companyId,
      parseInt(page),
      parseInt(limit),
      type,
      status,
    );
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser('company_id') companyId: string,
  ) {
    return this.reportsService.findOne(id, companyId);
  }

  @Post()
  async create(
    @Body() dto: CreateReportDto,
    @CurrentUser('company_id') companyId: string,
  ) {
    return this.reportsService.create(companyId, dto);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser('company_id') companyId: string,
  ) {
    return this.reportsService.remove(id, companyId);
  }
}