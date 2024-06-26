import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { HttpModule } from '@nestjs/axios';
import { join } from 'path';
import { CLIENT_URL } from './consts/client';
import { ReviewModule } from './review/review.module';
import { OrderModule } from './order/order.module';
import { StatisticModule } from './statistic/statistic.module';
import { PaginationModule } from './pagination/pagination.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    CategoryModule,
    ProductModule,
    UserModule,
    HttpModule.register({
      baseURL: CLIENT_URL,
      withCredentials: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ReviewModule,
    OrderModule,
    StatisticModule,
    PaginationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
