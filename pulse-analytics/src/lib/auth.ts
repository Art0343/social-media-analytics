import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';

// Check if we're in development mode
const isDev = process.env.NODE_ENV === 'development';

// Mock user for development bypass
const mockUser = isDev ? {
  id: 'demo-user-id',
  email: 'demo@pulse-analytics.io',
  name: 'Demo User',
  image: null,
} : null;

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user }) {
      // Allow all users in dev mode
      if (isDev) return true;
      
      // Optional domain restriction
      const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN;
      if (allowedDomain && user.email) {
        return user.email.endsWith(`@${allowedDomain}`);
      }
      return true;
    },
    async jwt({ token, user }) {
      // Use mock user in dev mode
      const effectiveUser = isDev && !user ? mockUser : user;
      
      if (effectiveUser) {
        token.id = effectiveUser.id;
        // Look up workspace membership to inject role
        const membership = await prisma.workspaceUser.findFirst({
          where: { userId: effectiveUser.id as string },
          select: { role: true, workspaceId: true },
        });
        token.role = membership?.role ?? 'ADMIN';
        token.workspaceId = membership?.workspaceId ?? 'demo-workspace';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session as any).role = token.role;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session as any).workspaceId = token.workspaceId;
      }
      return session;
    },
  },
});

// Export a dev-friendly auth function
export async function getSession(req?: Request) {
  if (isDev) {
    // Return mock session in dev mode
    return {
      user: {
        id: 'demo-user-id',
        email: 'demo@pulse-analytics.io',
        name: 'Demo User',
        image: null,
      },
      role: 'ADMIN',
      workspaceId: 'demo-workspace',
    };
  }
  return auth();
}
