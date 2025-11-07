import request from 'supertest';
import express from 'express';
import cors from 'cors';
import ministryRoutes from '../../src/routes/ministries';
import { getTestPrismaClient, createTestDiocese, createTestParish } from '../utils/testHelpers';

// Create a minimal Express app for testing
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/ministries', ministryRoutes);

describe('Ministry API Integration Tests', () => {
    let prisma: any;
    let dioceseId: string;
    let parishId1: string;
    let parishId2: string;

    beforeAll(async () => {
        prisma = getTestPrismaClient();
    });

    beforeEach(async () => {
        // Set up test data
        const diocese = await createTestDiocese();
        dioceseId = diocese.id;

        const parish1 = await createTestParish(dioceseId, {
            name: 'First Test Parish',
            address: '100 First St'
        });
        parishId1 = parish1.id;

        const parish2 = await createTestParish(dioceseId, {
            name: 'Second Test Parish',
            address: '200 Second St'
        });
        parishId2 = parish2.id;
    });

    describe('Comprehensive duplicate prevention workflow', () => {
        it('should handle complete ministry lifecycle with duplicate prevention', async () => {
            // Step 1: Create a ministry successfully
            const ministryData = {
                name: 'Youth Ministry',
                description: 'Dynamic youth program for teenagers',
                type: 'YOUTH_MINISTRY',
                ageGroups: ['TEENAGERS'],
                languages: ['en', 'es'],
                schedule: {
                    weekly: 'Sunday 6:00 PM',
                    location: 'Youth Center'
                },
                contactName: 'John Smith',
                contactPhone: '555-0123',
                contactEmail: 'youth@parish.org',
                requiresRegistration: true,
                maxParticipants: 30,
                isAccessible: true,
                requirements: ['Parent permission slip'],
                materials: ['Bible', 'Notebook'],
                cost: 'Free',
                parishId: parishId1
            };

            const createResponse = await request(app)
                .post('/api/ministries')
                .send(ministryData);

            expect(createResponse.status).toBe(201);
            expect(createResponse.body.name).toBe(ministryData.name);
            expect(createResponse.body.parish).toBeDefined();
            const ministryId = createResponse.body.id;

            // Step 2: Attempt to create duplicate ministry (should fail)
            const duplicateResponse = await request(app)
                .post('/api/ministries')
                .send({
                    ...ministryData,
                    description: 'Another youth ministry'
                });

            expect(duplicateResponse.status).toBe(409);
            expect(duplicateResponse.body.error).toBe('Duplicate ministry');

            // Step 3: Create ministry with same name in different parish (should succeed)
            const secondParishMinistry = await request(app)
                .post('/api/ministries')
                .send({
                    ...ministryData,
                    parishId: parishId2,
                    description: 'Youth ministry at second parish'
                });

            expect(secondParishMinistry.status).toBe(201);
            expect(secondParishMinistry.body.parishId).toBe(parishId2);

            // Step 4: Update the original ministry (same name, should succeed)
            const updateSameNameResponse = await request(app)
                .put(`/api/ministries/${ministryId}`)
                .send({
                    ...ministryData,
                    description: 'Updated description',
                    maxParticipants: 40
                });

            expect(updateSameNameResponse.status).toBe(200);
            expect(updateSameNameResponse.body.description).toBe('Updated description');
            expect(updateSameNameResponse.body.maxParticipants).toBe(40);

            // Step 5: Update to a new unique name (should succeed)
            const updateNewNameResponse = await request(app)
                .put(`/api/ministries/${ministryId}`)
                .send({
                    ...ministryData,
                    name: 'Teen Ministry',
                    description: 'Renamed youth ministry'
                });

            expect(updateNewNameResponse.status).toBe(200);
            expect(updateNewNameResponse.body.name).toBe('Teen Ministry');

            // Step 6: Create new ministry with the original name (should succeed now)
            const reuseNameResponse = await request(app)
                .post('/api/ministries')
                .send({
                    ...ministryData,
                    description: 'New ministry with reused name'
                });

            expect(reuseNameResponse.status).toBe(201);

            // Step 7: Try to update ministry to conflict with existing name (should fail)
            const conflictUpdateResponse = await request(app)
                .put(`/api/ministries/${ministryId}`)
                .send({
                    ...ministryData,
                    name: 'Youth Ministry', // This name is now taken by the new ministry
                    description: 'Trying to conflict'
                });

            expect(conflictUpdateResponse.status).toBe(409);
            expect(conflictUpdateResponse.body.error).toBe('Duplicate ministry');
        });

        it('should handle edge cases properly', async () => {
            const baseMinistryData = {
                description: 'Test ministry',
                type: 'BIBLE_STUDY',
                ageGroups: ['ADULTS'],
                languages: ['en'],
                schedule: { weekly: 'Wednesday 7:00 PM' },
                parishId: parishId1
            };

            // Test case sensitivity and whitespace
            const testCases = [
                { name: 'Bible Study Group', shouldCreate: true },
                { name: 'BIBLE STUDY GROUP', shouldCreate: false, reason: 'case insensitive' },
                { name: 'bible study group', shouldCreate: false, reason: 'case insensitive' },
                { name: '  Bible Study Group  ', shouldCreate: false, reason: 'whitespace trimmed' },
                { name: '\tBible Study Group\n', shouldCreate: false, reason: 'whitespace trimmed' }
            ];

            for (let i = 0; i < testCases.length; i++) {
                const testCase = testCases[i];
                const response = await request(app)
                    .post('/api/ministries')
                    .send({
                        ...baseMinistryData,
                        name: testCase.name
                    });

                if (testCase.shouldCreate) {
                    expect(response.status).toBe(201);
                } else {
                    expect(response.status).toBe(409);
                }
            }
        });

        it('should verify database constraint as backup', async () => {
            // First create a ministry normally
            const ministryData = {
                name: 'Constraint Test Ministry',
                description: 'Testing database constraints',
                type: 'OTHER',
                ageGroups: ['ALL_AGES'],
                languages: ['en'],
                schedule: { weekly: 'TBD' },
                parishId: parishId1
            };

            const response = await request(app)
                .post('/api/ministries')
                .send(ministryData);

            expect(response.status).toBe(201);

            // Try to create duplicate directly in database (should fail at DB level)
            try {
                await prisma.ministry.create({
                    data: {
                        name: 'Constraint Test Ministry',
                        type: 'OTHER',
                        ageGroups: ['ALL_AGES'],
                        languages: ['en'],
                        schedule: { weekly: 'TBD' },
                        parishId: parishId1
                    }
                });
                fail('Database constraint should have prevented this');
            } catch (error: any) {
                expect(error.code).toBe('P2002'); // Prisma unique constraint violation
                expect(error.meta?.target).toContain('unique_ministry_per_parish');
            }
        });
    });

    describe('Data validation integration', () => {
        it('should validate all required fields before checking duplicates', async () => {
            const invalidData = {
                name: 'Test Ministry'
                // Missing required fields
            };

            const response = await request(app)
                .post('/api/ministries')
                .send(invalidData);

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Validation error');
            expect(response.body.details).toBeDefined();
        });

        it('should check duplicates after validation passes', async () => {
            const validData = {
                name: 'Valid Test Ministry',
                type: 'BIBLE_STUDY',
                ageGroups: ['ADULTS'],
                languages: ['en'],
                schedule: { weekly: 'Wednesday' },
                parishId: parishId1
            };

            // Create first ministry
            const firstResponse = await request(app)
                .post('/api/ministries')
                .send(validData);

            expect(firstResponse.status).toBe(201);

            // Try to create duplicate
            const duplicateResponse = await request(app)
                .post('/api/ministries')
                .send(validData);

            expect(duplicateResponse.status).toBe(409);
            expect(duplicateResponse.body.error).toBe('Duplicate ministry');
        });
    });

    describe('Error handling', () => {
        it('should handle invalid parish IDs', async () => {
            const ministryData = {
                name: 'Invalid Parish Ministry',
                type: 'BIBLE_STUDY',
                ageGroups: ['ADULTS'],
                languages: ['en'],
                schedule: { weekly: 'Never' },
                parishId: 'invalid-parish-id'
            };

            const response = await request(app)
                .post('/api/ministries')
                .send(ministryData);

            expect(response.status).toBe(500);
        });

        it('should handle malformed request data gracefully', async () => {
            const response = await request(app)
                .post('/api/ministries')
                .send('invalid json')
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(400);
        });
    });
});