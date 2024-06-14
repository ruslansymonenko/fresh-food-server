import { Controller, Get, Param } from '@nestjs/common';
import { OrderService } from './order.service';
import { Auth } from '../auth/decoratos/auth.decorator';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('user-orders/:userId')
  @Auth()
  async getUserOrders(@Param('userId') userId: string) {
    return this.orderService.getUserOrders(userId);
  }
}
