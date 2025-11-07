import { PrismaClient } from '@prisma/client';

declare global {
    var __PRISMA__: PrismaClient | undefined;
}

// Ensure we have a clean database for each test
beforeEach(async () => {
    if ((global as any).__PRISMA__) {
        // Clean up test data
        await (global as any).__PRISMA__.ministry.deleteMany();
        await (global as any).__PRISMA__.parish.deleteMany();
        await (global as any).__PRISMA__.diocese.deleteMany();
        await (global as any).__PRISMA__.user.deleteMany();
    }
});

afterAll(async () => {
    if ((global as any).__PRISMA__) {
        await (global as any).__PRISMA__.$disconnect();
    }
});