import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

export const getTestPrismaClient = () => {
    if (!prisma) {
        prisma = new PrismaClient({
            datasources: {
                db: {
                    url: process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/find_my_ministry_test'
                }
            }
        });
        (global as any).__PRISMA__ = prisma;
    }
    return prisma;
};

export const createTestDiocese = async (overrides: any = {}) => {
    const client = getTestPrismaClient();
    return await client.diocese.create({
        data: {
            name: 'Test Diocese',
            location: 'Test City, TS',
            website: 'https://testdiocese.org',
            phone: '555-0123',
            email: 'contact@testdiocese.org',
            ...overrides
        }
    });
};

export const createTestParish = async (dioceseId: string, overrides: any = {}) => {
    const client = getTestPrismaClient();
    return await client.parish.create({
        data: {
            name: 'Test Parish',
            address: '123 Test St',
            city: 'Test City',
            state: 'TS',
            zipCode: '12345',
            latitude: 40.7128,
            longitude: -74.0060,
            phone: '555-0124',
            email: 'contact@testparish.org',
            website: 'https://testparish.org',
            pastor: 'Father Test',
            dioceseId,
            ...overrides
        }
    });
};

export const createTestMinistry = async (parishId: string, overrides: any = {}) => {
    const client = getTestPrismaClient();
    return await client.ministry.create({
        data: {
            name: 'Test Ministry',
            description: 'A test ministry for testing purposes',
            type: 'BIBLE_STUDY',
            ageGroups: ['ADULTS'],
            languages: ['en'],
            schedule: { weekly: 'Wednesday 7:00 PM' },
            contactName: 'Test Contact',
            contactPhone: '555-0125',
            contactEmail: 'test@testparish.org',
            parishId,
            ...overrides
        }
    });
};

export const cleanupTestData = async () => {
    const client = getTestPrismaClient();
    await client.ministry.deleteMany();
    await client.parish.deleteMany();
    await client.diocese.deleteMany();
    await client.user.deleteMany();
};