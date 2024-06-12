import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { returnUserObject } from './return-user.object';
import { USER_ROLES } from '../../types/user';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getById(id: string, selectObject: Prisma.UserSelect = {}) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        ...returnUserObject,
        favorites: {
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
            slug: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user) throw new NotFoundException('product not found');

    return user;
  }

  async toogleFavorite(userId: string, productId: string) {
    const user = await this.getById(userId);

    if (!user) throw new NotFoundException('product not found');

    const isExist = user.favorites.some((product) => product.id === productId);

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        favorites: {
          [isExist ? 'disconnect' : 'connect']: {
            id: productId,
          },
        },
      },
    });

    return { message: 'success' };
  }

  async changeRole(userId: string, updatedRole: USER_ROLES) {
    const user = await this.getById(userId);

    if (!user) throw new NotFoundException('product not found');

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        user_role: updatedRole,
      },
    });

    return { message: 'success' };
  }
}
