import { Prisma } from '@prisma/client';
import { returnCategoryObject } from '../category/return-category.object';
import { returnReviewObject } from '../review/return-review.object';

export const returnProductObject: Prisma.ProductSelect = {
  id: true,
  name: true,
  description: true,
  price: true,
  createdAt: true,
  images: true,
  category: { select: returnCategoryObject },
};

export const returnProductFullObject: Prisma.ProductSelect = {
  ...returnProductObject,
  category: { select: returnCategoryObject },
  reviews: { select: returnReviewObject },
};
