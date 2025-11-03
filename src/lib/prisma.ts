// Avoid importing @prisma/client during production frontend builds on hosts
// that don't run `prisma generate`. The frontend should not use Prisma
// directly in production; server-side DB access belongs in the backend.
//
// Behavior:
// - In development (NODE_ENV !== 'production') we load Prisma so local dev works.
// - In production we export a stub that throws if used, preventing build-time
//   initialization errors like "@prisma/client did not initialize yet".

type AnyPrisma = any;

let prisma: AnyPrisma;

if (process.env.NODE_ENV !== 'production') {
  // Lazy require so types/tools that analyze imports won't eagerly require generated client
  // in production build steps on hosts where `prisma generate` wasn't run.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { PrismaClient } = require('@prisma/client');

  const globalForPrisma = globalThis as unknown as { prisma?: AnyPrisma };

  prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

  if ((process.env.NODE_ENV as string) !== 'production') globalForPrisma.prisma = prisma;
} else {
  // In production builds for the frontend we export a stub that clearly instructs
  // developers to call the backend API instead of Prisma directly. This prevents
  // the build/runtime from attempting to initialize Prisma on hosts that don't
  // have the generated client available.
  prisma = new Proxy({}, {
    get() {
      return () => {
        throw new Error(
          'Prisma client is not available in the frontend production build. Call the backend API instead.'
        );
      };
    },
  });
}

export { prisma };