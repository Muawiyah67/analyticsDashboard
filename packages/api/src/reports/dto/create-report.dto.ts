import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';
import { ReportType } from '@nexus/shared';

export class CreateReportDto {
  @IsString()
  name: string;

  @IsEnum(ReportType)
  type: ReportType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  dateRangeStart?: string;

  @IsOptional()
  @IsString()
  dateRangeEnd?: string;

  @IsOptional()
  @IsObject()
  filters?: Record<string, any>;
}
