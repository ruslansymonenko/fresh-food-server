import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, User } from '@prisma/client';
import { returnUserObject } from './return-user.object';
import { USER_ROLES } from '../../types/user';
import { faker } from '@faker-js/faker';
import { UserDto } from './dto/user.dto';
import { hash } from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(dto: UserDto): Promise<User | null> {
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: faker.person.firstName(),
        phone: faker.phone.number(),
        password: await hash(dto.password),
      },
    });

    if (user) {
      return user;
    } else {
      return null;
    }
  }

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
            images: true,
            slug: true,
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
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

    const isExist: boolean = user.favorites.some((product) => product.id === productId);

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
        userRole: updatedRole,
      },
    });

    return { message: 'success' };
  }
}
