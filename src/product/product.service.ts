import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { returnProductObject } from './return-product.object';
import { ProductDto } from './dto/product.dto';
import { generateSlug } from '../utils/generate-slug';
import { CategoryService } from '../category/category.service';
import { EnumProductSort, GetAllProductDto } from './dto/getAllProduct.dto';
import { PaginationService } from '../pagination/pagination.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private categoryService: CategoryService,
    private paginationService: PaginationService,
  ) {}

  async checkProduct(id: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
      select: returnProductObject,
    });

    if (!product) return null;

    return product;
  }

  async getAll(dto: GetAllProductDto = {}) {
    const { sort, searchTerm } = dto;

    const prismaSort: Prisma.ProductOrderByWithRelationInput[] = [];

    switch (sort) {
      case EnumProductSort.LOW_PRICE:
        prismaSort.push({ price: 'asc' });
        break;
      case EnumProductSort.HIGH_PRICE:
        prismaSort.push({ price: 'desc' });
        break;
      case EnumProductSort.NEWEST:
        prismaSort.push({ createdAt: 'desc' });
        break;
      case EnumProductSort.OLDEST:
        prismaSort.push({ createdAt: 'asc' });
        break;
      default:
        prismaSort.push({ createdAt: 'desc' });
    }

    const prismaSearchTermFilter: Prisma.ProductWhereInput = searchTerm
      ? {
          OR: [
            {
              category: {
                name: {
                  contains: searchTerm,
                  mode: 'insensitive',
                },
              },
            },
            {
              name: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          ],
        }
      : {};

    const { perPage, skip } = this.paginationService.getPagination(dto);

    const products = await this.prisma.product.findMany({
      where: prismaSearchTermFilter,
      orderBy: prismaSort,
      skip,
      take: perPage,
    });

    return {
      products,
      length: await this.prisma.product.count({
        where: prismaSearchTermFilter,
      }),
    };
  }

  async search(searchTerm: string) {
    return this.prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: returnProductObject,
    });
  }

  async getBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        slug,
      },
      select: returnProductObject,
    });

    if (!product) throw new NotFoundException('product not found');

    return product;
  }

  async getByCategory(categorySlug: string) {
    const products = await this.prisma.product.findMany({
      where: {
        category: {
          slug: categorySlug,
        },
      },
      select: returnProductObject,
    });

    if (!products) throw new NotFoundException('Products not found');

    return products;
  }

  async getSimilar(productId: string) {
    const product = await this.checkProduct(productId);

    if (!product) throw new NotFoundException('product not found');

    const products = await this.prisma.product.findMany({
      where: {
        category: {
          name: product.category.name,
        },
        NOT: {
          id: product.id,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: returnProductObject,
    });

    return products;
  }

  async create() {
    return this.prisma.product.create({
      data: {
        name: '',
        slug: '',
        description: '',
        price: 0,
      },
    });
  }

  async update(id: string, dto: ProductDto) {
    const { name, description, price, categoryId, images } = dto;
    const isProduct = await this.checkProduct(id);

    if (!isProduct) throw new NotFoundException('product not found');

    await this.categoryService.getById(categoryId);

    return this.prisma.product.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        price,
        images,
        slug: generateSlug(name),
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
    });
  }

  async delete(id: string) {
    const isproduct = await this.checkProduct(id);

    if (!isproduct) throw new NotFoundException('product not found');

    return this.prisma.product.delete({
      where: {
        id,
      },
    });
  }
}
