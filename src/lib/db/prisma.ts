// To provide development environment a prisma client on load.

import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prismaBase = globalThis.prisma ?? prismaClientSingleton();

// Added this section to apply changes to the update on "cart"
// this changes are applied globally therefore, use with caution.
const prisma = prismaBase.$extends({
  query: {
    cart: {
      async update({ args, query }) {
        args.data = { ...args.data, updateAt: new Date() };
        return query(args);
      },
    },
  },
});
export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prismaBase;
