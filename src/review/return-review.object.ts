import { Prisma } from '@prisma/client';
import { returnUserObject } from '../user/return-user.object';

export const returnReviewObject: Prisma.ReviewSelect = {
  user: {
    select: returnUserObject,
  },
  id: true,
  text: true,
  rating: true,
};
