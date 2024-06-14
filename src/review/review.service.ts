import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { returnReviewObject } from './return-review.object';
import { ReviewDto } from './dto/review.dto';
import { UserService } from '../user/user.service';
import { ProductService } from '../product/product.service';

@Injectable()
export class ReviewService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private productService: ProductService,
  ) {}

  async checkReview(id: string) {
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
    if (!userId && !productId) throw new NotFoundException('User or Product not found');

    const isUser = await this.userService.getById(userId);
    if (!isUser) throw new NotFoundException('User not found');

    const isProduct = await this.productService.checkProduct(productId);
    if (!isProduct) throw new NotFoundException('Product not found');

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
    const isProduct = await this.productService.checkProduct(productId);

    if (!isProduct) throw new NotFoundException('Product not found');

    return this.prisma.review
      .aggregate({
        where: { productId },
        _avg: { rating: true },
      })
      .then((data) => data._avg);
  }
}
