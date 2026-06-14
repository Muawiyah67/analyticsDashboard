import { IsOptional, IsString, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export enum RevenuePeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUAL = 'annual',
}

export enum TrafficPeriod {
  WEEK = 'week',
  MONTH = 'month',
}

export enum TopItemType {
  PRODUCTS = 'products',
  PAGES = 'pages',
}

export class AnalyticsStatsQueryDto {
  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}

export class RevenueQueryDto {
  @IsOptional()
  @IsEnum(RevenuePeriod)
  period?: RevenuePeriod;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}

export class TrafficQueryDto {
  @IsOptional()
  @IsEnum(TrafficPeriod)
  period?: TrafficPeriod;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}

export class TopItemsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsEnum(TopItemType)
  type?: TopItemType;
}