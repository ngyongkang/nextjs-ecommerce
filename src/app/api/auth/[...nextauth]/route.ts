import { PrismaAdapter } from '@auth/prisma-adapter';
import { NextAuthOptions } from 'next-auth';
import prisma from '@/lib/db/prisma';
import { Adapter } from 'next-auth/adapters';
import Google from 'next-auth/providers/google';
import NextAuth from 'next-auth/next';
import { env } from '@/lib/env';
import { User } from '@prisma/client';

// By adding the callback section we can change the
// default session variables. As it is in TS we need to add the type
// as well.
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      session.user.type = (user as User).type;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
