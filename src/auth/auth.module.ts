import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJwtConfig } from '../config/jwt.config';
import { LogRequestInterceptor } from '../utils/log-request-interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    JwtStrategy,
    { provide: APP_INTERCEPTOR, useClass: LogRequestInterceptor }, //DEV ONLY! Remove from
    // production
  ],
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
  ],
})
export class AuthModule {}
