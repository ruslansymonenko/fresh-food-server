import { Module } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { StatisticController } from './statistic.controller';
import { UserService } from '../user/user.service';
import { ProductService } from '../product/product.service';
import { PrismaService } from '../prisma.service';
import { CategoryService } from '../category/category.service';
import { PaginationService } from '../pagination/pagination.service';

@Module({
  controllers: [StatisticController],
  providers: [
    StatisticService,
    CategoryService,
    ProductService,
    UserService,
    PrismaService,
    PaginationService,
  ],
})
export class StatisticModule {}
