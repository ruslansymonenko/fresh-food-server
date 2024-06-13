import * as dotenv from 'dotenv';
import { PrismaClient, Product } from '@prisma/client';
import { faker } from '@faker-js/faker';

dotenv.config();
const prisma = new PrismaClient();

const createProducts = async (quantity: number) => {
  const products: Product[] = [];

  for (let i = 0; i < quantity; i++) {
    const productName = faker.commerce.productName();
    const categoryName = faker.commerce.department();

    const product = await prisma.product.create({
      data: {
        name: productName,
        slug: faker.helpers.slugify(productName),
        description: faker.lorem.paragraph(),
        price: +faker.commerce.price(10, 999, 0),
        images: Array.from({ length: faker.datatype.number({ min: 2, max: 6 }) }).map(() =>
          faker.image.imageUrl(),
        ),
        category: {
          create: {
            name: categoryName,
            slug: faker.helpers.slugify(categoryName),
            image: faker.image.imageUrl(),
          },
        },
        reviews: {
          create: [
            {
              rating: faker.datatype.number({ min: 1, max: 5 }),
              text: faker.lorem.paragraph(),
              user: {
                connect: {
                  id: 'clxdj3umc0000ree6b6lexuvo',
                },
              },
            },
            {
              rating: faker.datatype.number({ min: 1, max: 5 }),
              text: faker.lorem.paragraph(),
              user: {
                connect: {
                  id: 'clxdj3umc0000ree6b6lexuvo',
                },
              },
            },
            {
              rating: faker.datatype.number({ min: 1, max: 5 }),
              text: faker.lorem.paragraph(),
              user: {
                connect: {
                  id: 'clxdj3umc0000ree6b6lexuvo',
                },
              },
            },
          ],
        },
      },
    });
    products.push(product);
  }

  console.log(`Created ${products.length} products`);
};

async function main() {
  console.log('Start seeding. . .');
  await createProducts(20);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
