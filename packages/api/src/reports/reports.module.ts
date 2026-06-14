import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { ReportsDownloadController } from './reports-download.controller';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [ReportsController, ReportsDownloadController],
  providers: [ReportsService],
})
export class ReportsModule {}