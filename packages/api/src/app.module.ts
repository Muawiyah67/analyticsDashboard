import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { SupabaseModule } from './supabase/supabase.module';
import { ReportsModule } from './reports/reports.module';
import { CustomersModule } from './customers/customers.module';

@Module({
  imports: [AuthModule, CustomersModule,  OrdersModule, ProductsModule, AnalyticsModule, SupabaseModule, ReportsModule],
})
export class AppModule {}
