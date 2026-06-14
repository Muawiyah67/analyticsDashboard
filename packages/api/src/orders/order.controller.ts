import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';

@ApiTags('Orders')
@Controller('orders')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseInterceptor)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  async findAll(
    @CurrentUser('company_id') companyId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('status') status?: string,
    @Query('customerId') customerId?: string,
  ) {
    return this.ordersService.findAll(
      companyId,
      parseInt(page),
      parseInt(limit),
      status,
      customerId,
    );
  }

  @Get('stats')
  async getStats(@CurrentUser('company_id') companyId: string) {
    return this.ordersService.getStats(companyId);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser('company_id') companyId: string,
  ) {
    return this.ordersService.findOne(id, companyId);
  }

  @Post()
  async create(
    @Body() dto: CreateOrderDto,
    @CurrentUser('company_id') companyId: string,
  ) {
    return this.ordersService.create(companyId, dto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateOrderDto,
    @CurrentUser('company_id') companyId: string,
  ) {
    return this.ordersService.update(id, companyId, dto);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser('company_id') companyId: string,
  ) {
    return this.ordersService.remove(id, companyId);
  }
}