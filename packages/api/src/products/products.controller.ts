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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';

@ApiTags('Products')
@Controller('products')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseInterceptor)
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async findAll(
    @CurrentUser('company_id') companyId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.productsService.findAll(
      companyId,
      parseInt(page),
      parseInt(limit),
      category,
      search,
    );
  }

  @Get('stats')
  async getStats(@CurrentUser('company_id') companyId: string) {
    return this.productsService.getStats(companyId);
  }

  @Get('categories')
  async getCategories(@CurrentUser('company_id') companyId: string) {
    return this.productsService.getCategories(companyId);
  }

  @Get('low-stock')
  async getLowStock(@CurrentUser('company_id') companyId: string) {
    return this.productsService.getLowStock(companyId);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser('company_id') companyId: string,
  ) {
    return this.productsService.findOne(id, companyId);
  }

  @Get('sku/:sku')
  async findBySku(
    @Param('sku') sku: string,
    @CurrentUser('company_id') companyId: string,
  ) {
    return this.productsService.findBySku(sku, companyId);
  }

  @Get('category/:category')
  async findByCategory(
    @Param('category') category: string,
    @CurrentUser('company_id') companyId: string,
  ) {
    return this.productsService.findByCategory(category, companyId);
  }

  @Post()
  async create(
    @Body() dto: CreateProductDto,
    @CurrentUser('company_id') companyId: string,
  ) {
    return this.productsService.create(companyId, dto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @CurrentUser('company_id') companyId: string,
  ) {
    return this.productsService.update(id, companyId, dto);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser('company_id') companyId: string,
  ) {
    return this.productsService.remove(id, companyId);
  }
}