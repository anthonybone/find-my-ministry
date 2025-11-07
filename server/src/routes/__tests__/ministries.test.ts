import request from 'supertest';
import express from 'express';
import { getTestPrismaClient, createTestDiocese, createTestParish, createTestMinistry } from '../../__tests__/utils/testHelpers';

// Mock the prisma import in ministries.ts
const mockPrisma = getTestPrismaClient();
jest.mock('../../index', () => ({
    prisma: mockPrisma,
}));

// Now import the routes after mocking
const ministryRoutes = require('../ministries').default;

// Create a minimal Express app for testing
const app = express();
app.use(express.json());
app.use('/api/ministries', ministryRoutes);

describe('Ministry Routes', () => {
    let prisma: any;
    let dioceseId: string;
    let parishId: string;

    beforeAll(() => {
        prisma = getTestPrismaClient();
    });

    beforeEach(async () => {
        // Create test diocese and parish for each test
        const diocese = await createTestDiocese();
        dioceseId = diocese.id;

        const parish = await createTestParish(dioceseId);
        parishId = parish.id;
    });

    describe('POST /api/ministries', () => {
        it('should create a new ministry successfully', async () => {
            const ministryData = {
                name: 'Test Bible Study',
                description: 'A weekly bible study group',
                type: 'BIBLE_STUDY',
                ageGroups: ['ADULTS'],
                languages: ['en'],
                schedule: { weekly: 'Wednesday 7:00 PM' },
                parishId
            };

            const response = await request(app)
                .post('/api/ministries')
                .send(ministryData);

            expect(response.status).toBe(201);
            expect(response.body.name).toBe(ministryData.name);
            expect(response.body.parishId).toBe(parishId);
        });

        it('should prevent creation of duplicate ministry (same name and parish)', async () => {
            const ministryData = {
                name: 'Test Bible Study',
                description: 'A weekly bible study group',
                type: 'BIBLE_STUDY',
                ageGroups: ['ADULTS'],
                languages: ['en'],
                schedule: { weekly: 'Wednesday 7:00 PM' },
                parishId
            };

            // Create the first ministry
            const firstResponse = await request(app)
                .post('/api/ministries')
                .send(ministryData);

            expect(firstResponse.status).toBe(201);

            // Try to create the same ministry again
            const secondResponse = await request(app)
                .post('/api/ministries')
                .send(ministryData);

            expect(secondResponse.status).toBe(409);
            expect(secondResponse.body.error).toBe('Duplicate ministry');
            expect(secondResponse.body.message).toContain('already exists in this parish');
        });

        it('should allow same ministry name in different parishes', async () => {
            // Create second parish
            const secondParish = await createTestParish(dioceseId, { name: 'Second Test Parish' });

            const ministryData1 = {
                name: 'Bible Study Group',
                description: 'A weekly bible study group',
                type: 'BIBLE_STUDY',
                ageGroups: ['ADULTS'],
                languages: ['en'],
                schedule: { weekly: 'Wednesday 7:00 PM' },
                parishId
            };

            const ministryData2 = {
                name: 'Bible Study Group', // Same name
                description: 'Another weekly bible study group',
                type: 'BIBLE_STUDY',
                ageGroups: ['ADULTS'],
                languages: ['en'],
                schedule: { weekly: 'Thursday 7:00 PM' },
                parishId: secondParish.id // Different parish
            };

            const firstResponse = await request(app)
                .post('/api/ministries')
                .send(ministryData1);

            expect(firstResponse.status).toBe(201);

            const secondResponse = await request(app)
                .post('/api/ministries')
                .send(ministryData2);

            expect(secondResponse.status).toBe(201);
            expect(secondResponse.body.name).toBe(ministryData2.name);
            expect(secondResponse.body.parishId).toBe(secondParish.id);
        });

        it('should handle case sensitivity properly (prevent duplicates regardless of case)', async () => {
            const ministryData1 = {
                name: 'Youth Ministry',
                description: 'Youth ministry program',
                type: 'YOUTH_MINISTRY',
                ageGroups: ['TEENAGERS'],
                languages: ['en'],
                schedule: { weekly: 'Sunday 6:00 PM' },
                parishId
            };

            const ministryData2 = {
                name: 'youth ministry', // Different case
                description: 'Another youth ministry program',
                type: 'YOUTH_MINISTRY',
                ageGroups: ['TEENAGERS'],
                languages: ['en'],
                schedule: { weekly: 'Sunday 7:00 PM' },
                parishId
            };

            const firstResponse = await request(app)
                .post('/api/ministries')
                .send(ministryData1);

            expect(firstResponse.status).toBe(201);

            const secondResponse = await request(app)
                .post('/api/ministries')
                .send(ministryData2);

            // Should still prevent duplicate (case insensitive)
            expect(secondResponse.status).toBe(409);
        });

        it('should handle whitespace properly (trim and prevent duplicates)', async () => {
            const ministryData1 = {
                name: 'Prayer Group',
                description: 'Weekly prayer group',
                type: 'PRAYER_GROUP',
                ageGroups: ['ADULTS'],
                languages: ['en'],
                schedule: { weekly: 'Tuesday 7:00 PM' },
                parishId
            };

            const ministryData2 = {
                name: '  Prayer Group  ', // Same name with whitespace
                description: 'Another prayer group',
                type: 'PRAYER_GROUP',
                ageGroups: ['ADULTS'],
                languages: ['en'],
                schedule: { weekly: 'Thursday 7:00 PM' },
                parishId
            };

            const firstResponse = await request(app)
                .post('/api/ministries')
                .send(ministryData1);

            expect(firstResponse.status).toBe(201);

            const secondResponse = await request(app)
                .post('/api/ministries')
                .send(ministryData2);

            expect(secondResponse.status).toBe(409);
        });
    });

    describe('PUT /api/ministries/:id', () => {
        it('should update ministry without duplicate error when no name change', async () => {
            // Create initial ministry
            const ministry = await createTestMinistry(parishId, {
                name: 'Test Ministry',
                type: 'BIBLE_STUDY'
            });

            const updateData = {
                name: 'Test Ministry', // Same name
                description: 'Updated description',
                type: 'BIBLE_STUDY',
                ageGroups: ['ADULTS'],
                languages: ['en'],
                schedule: { weekly: 'Updated schedule' },
                parishId
            };

            const response = await request(app)
                .put(`/api/ministries/${ministry.id}`)
                .send(updateData);

            expect(response.status).toBe(200);
            expect(response.body.description).toBe('Updated description');
        });

        it('should update ministry name when new name is unique', async () => {
            // Create initial ministry
            const ministry = await createTestMinistry(parishId, {
                name: 'Old Ministry Name',
                type: 'BIBLE_STUDY'
            });

            const updateData = {
                name: 'New Unique Ministry Name',
                description: 'Updated ministry',
                type: 'BIBLE_STUDY',
                ageGroups: ['ADULTS'],
                languages: ['en'],
                schedule: { weekly: 'Updated schedule' },
                parishId
            };

            const response = await request(app)
                .put(`/api/ministries/${ministry.id}`)
                .send(updateData);

            expect(response.status).toBe(200);
            expect(response.body.name).toBe('New Unique Ministry Name');
        });

        it('should prevent update when new name conflicts with existing ministry', async () => {
            // Create two ministries
            const ministry1 = await createTestMinistry(parishId, {
                name: 'Ministry One',
                type: 'BIBLE_STUDY'
            });

            const ministry2 = await createTestMinistry(parishId, {
                name: 'Ministry Two',
                type: 'YOUTH_MINISTRY'
            });

            // Try to update ministry2 to have the same name as ministry1
            const updateData = {
                name: 'Ministry One', // Conflicting name
                description: 'Trying to use existing name',
                type: 'YOUTH_MINISTRY',
                ageGroups: ['TEENAGERS'],
                languages: ['en'],
                schedule: { weekly: 'Updated schedule' },
                parishId
            };

            const response = await request(app)
                .put(`/api/ministries/${ministry2.id}`)
                .send(updateData);

            expect(response.status).toBe(409);
            expect(response.body.error).toBe('Duplicate ministry');
        });

        it('should handle non-existent ministry ID', async () => {
            const updateData = {
                name: 'Non-existent Ministry',
                description: 'This should fail',
                type: 'BIBLE_STUDY',
                ageGroups: ['ADULTS'],
                languages: ['en'],
                schedule: { weekly: 'Never' },
                parishId
            };

            const response = await request(app)
                .put('/api/ministries/non-existent-id')
                .send(updateData);

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Ministry not found');
        });
    });

    describe('Database constraint enforcement', () => {
        it('should handle database-level constraint violation', async () => {
            // This test ensures that even if validation somehow fails,
            // the database constraint will catch duplicates

            const ministryData = {
                name: 'Database Constraint Test',
                description: 'Testing database constraint',
                type: 'BIBLE_STUDY',
                ageGroups: ['ADULTS'],
                languages: ['en'],
                schedule: { weekly: 'Test' },
                parishId
            };

            // Create directly in database to bypass validation
            await prisma.ministry.create({ data: ministryData });

            // Now try to create via API (should be caught by database constraint)
            try {
                await prisma.ministry.create({ data: ministryData });
                fail('Should have thrown constraint violation error');
            } catch (error: any) {
                expect(error.code).toBe('P2002'); // Prisma unique constraint violation
            }
        });
    });
});