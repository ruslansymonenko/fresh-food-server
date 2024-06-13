import { Prisma } from '@prisma/client';
import { returnCategoryObject } from '../category/return-category.object';

export const returnProductObject: Prisma.ProductSelect = {
  id: true,
  name: true,
  description: true,
  price: true,
  createdAt: true,
  images: true,
  category: { select: returnCategoryObject },
};
