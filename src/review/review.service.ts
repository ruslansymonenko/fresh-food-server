import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { returnReviewObject } from './return-review.object';
import { ReviewDto } from './dto/review.dto';
import { generateSlug } from '../utils/generate-slug';
import { da } from '@faker-js/faker';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  private async checkReview(id: string) {
    const review = await this.prisma.review.findUnique({
      where: {
        id,
      },
      select: returnReviewObject,
    });

    if (!review) return null;

    return review;
  }

  async getAll() {
    return this.prisma.review.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: returnReviewObject,
    });
  }

  async getById(id: string) {
    const isReview = await this.checkReview(id);

    if (!isReview) throw new NotFoundException('Review not found');

    return isReview;
  }

  async create(userId: string, productId: string, dto: ReviewDto) {
    return this.prisma.review.create({
      data: {
        ...dto,
        product: {
          connect: {
            id: productId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async update(id: string, dto: ReviewDto) {
    const isReview = await this.checkReview(id);

    if (!isReview) throw new NotFoundException('Review not found');

    return this.prisma.review.update({
      where: {
        id,
      },
      data: {
        text: dto.text,
        rating: dto.rating,
      },
    });
  }

  async delete(id: string) {
    const isReview = await this.checkReview(id);

    if (!isReview) throw new NotFoundException('Review not found');

    return this.prisma.review.delete({
      where: {
        id,
      },
    });
  }

  async getAverageValueByProductId(productId: string) {
    return this.prisma.review
      .aggregate({
        where: { productId },
        _avg: { rating: true },
      })
      .then((data) => data._avg);
  }
}
