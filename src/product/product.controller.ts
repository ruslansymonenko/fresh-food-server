import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';
import { Auth } from '../auth/decoratos/auth.decorator';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('get-all')
  async getAll() {
    return this.productService.getAll();
  }

  @Get('by-slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.productService.getBySlug(slug);
  }

  @Get('by-category/:categorySlug')
  async getByCategory(@Param('categorySlug') categorySlug: string) {
    return this.productService.getByCategory(categorySlug);
  }

  @HttpCode(200)
  @Post('create')
  @Auth()
  async create() {
    return this.productService.create();
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put('update/:id')
  @Auth()
  async update(@Param('id') id: string, @Body() dto: ProductDto) {
    return this.productService.update(id, dto);
  }

  @HttpCode(200)
  @Delete('delete/:id')
  @Auth()
  async delete(@Param('id') id: string) {
    return this.productService.delete(id);
  }
}
