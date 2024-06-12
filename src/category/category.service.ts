import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { returnCategoryObject } from './return-category.object';
import { CategoryDto } from './dto/category.dto';
import { generateSlug } from '../utils/generate-slug';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  private async checkCategory(id: string) {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
      },
      select: returnCategoryObject,
    });

    if (!category) return null;

    return category;
  }

  async getAll() {
    return this.prisma.category.findMany({
      select: returnCategoryObject,
    });
  }

  async getById(id: string) {
    const isCategory = await this.checkCategory(id);

    if (!isCategory) throw new NotFoundException('Category not found');

    return isCategory;
  }

  async getBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: {
        slug,
      },
      select: returnCategoryObject,
    });

    if (!category) throw new NotFoundException('Category not found');

    return category;
  }

  async create() {
    return this.prisma.category.create({
      data: {
        name: '',
        slug: '',
        image: '',
      },
    });
  }

  async update(id: string, dto: CategoryDto) {
    const isCategory = await this.checkCategory(id);

    if (!isCategory) throw new NotFoundException('Category not found');

    return this.prisma.category.update({
      where: {
        id,
      },
      data: {
        name: dto.name,
        slug: generateSlug(dto.name),
        image: dto.image,
      },
    });
  }

  async delete(id: string) {
    const isCategory = await this.checkCategory(id);

    if (!isCategory) throw new NotFoundException('Category not found');

    return this.prisma.category.delete({
      where: {
        id,
      },
    });
  }
}
