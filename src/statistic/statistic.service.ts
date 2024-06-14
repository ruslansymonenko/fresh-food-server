import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserService } from '../user/user.service';

@Injectable()
export class StatisticService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
  ) {}

  async getMain(userId: string) {
    const user = await this.userService.getById(userId, {
      orders: {
        select: {
          orderItems: true,
        },
      },
      reviews: true,
    });

    const userOrdersSum = await this.prismaService.$queryRaw`
      SELECT SUM(oi.price * oi.quantity) AS total_spent
      FROM "order" o
      JOIN "order_item" oi ON o.id = oi.order_id
      WHERE o.user_id = ${userId}
    `;

    console.log(userOrdersSum);

    const userTotalOrdersSum = userOrdersSum[0]?.total_spent || 0;

    return [
      {
        name: 'Orders',
        value: user.orders?.length || 0,
      },
      {
        name: 'Reviews',
        value: user.reviews?.length || 0,
      },
      {
        name: 'Favorites',
        value: user.favorites?.length || 0,
      },
      {
        name: 'Total orders sum',
        value: userTotalOrdersSum,
      },
    ];
  }
}
