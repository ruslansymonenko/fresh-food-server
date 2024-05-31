import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { CategoryService } from '../category/category.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, PrismaService, CategoryService],
})
export class ProductModule {}
