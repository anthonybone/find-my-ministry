import { Request, Response, NextFunction } from 'express';
import { validateMinistry, createCheckDuplicateMinistry } from '../../src/validators/ministry';
import { getTestPrismaClient, createTestDiocese, createTestParish, createTestMinistry } from '../utils/testHelpers';

describe('Ministry Validators', () => {
    let prisma: any;
    let checkDuplicateMinistry: any;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeAll(() => {
        prisma = getTestPrismaClient();
        checkDuplicateMinistry = createCheckDuplicateMinistry(prisma);
    });

    beforeEach(() => {
        req = {
            body: {},
            params: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    describe('validateMinistry', () => {
        it('should pass validation with valid ministry data', () => {
            req.body = {
                name: 'Test Ministry',
                description: 'A test ministry',
                type: 'BIBLE_STUDY',
                ageGroups: ['ADULTS'],
                languages: ['en'],
                schedule: { weekly: 'Wednesday 7:00 PM' },
                parishId: 'test-parish-id'
            };

            validateMinistry(req as Request, res as Response, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        it('should fail validation when name is missing', () => {
            req.body = {
                description: 'A test ministry',
                type: 'BIBLE_STUDY',
                ageGroups: ['ADULTS'],
                languages: ['en'],
                schedule: { weekly: 'Wednesday 7:00 PM' },
                parishId: 'test-parish-id'
            };

            validateMinistry(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: 'Validation error',
                    details: expect.arrayContaining([
                        expect.objectContaining({
                            field: 'name',
                            message: expect.stringContaining('required')
                        })
                    ])
                })
            );
            expect(next).not.toHaveBeenCalled();
        });

        it('should fail validation when type is invalid', () => {
            req.body = {
                name: 'Test Ministry',
                description: 'A test ministry',
                type: 'INVALID_TYPE',
                ageGroups: ['ADULTS'],
                languages: ['en'],
                schedule: { weekly: 'Wednesday 7:00 PM' },
                parishId: 'test-parish-id'
            };

            validateMinistry(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: 'Validation error'
                })
            );
            expect(next).not.toHaveBeenCalled();
        });

        it('should fail validation when ageGroups is missing', () => {
            req.body = {
                name: 'Test Ministry',
                description: 'A test ministry',
                type: 'BIBLE_STUDY',
                languages: ['en'],
                schedule: { weekly: 'Wednesday 7:00 PM' },
                parishId: 'test-parish-id'
            };

            validateMinistry(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: 'Validation error',
                    details: expect.arrayContaining([
                        expect.objectContaining({
                            field: 'ageGroups',
                            message: expect.stringContaining('required')
                        })
                    ])
                })
            );
            expect(next).not.toHaveBeenCalled();
        });

        it('should fail validation when parishId is missing', () => {
            req.body = {
                name: 'Test Ministry',
                description: 'A test ministry',
                type: 'BIBLE_STUDY',
                ageGroups: ['ADULTS'],
                languages: ['en'],
                schedule: { weekly: 'Wednesday 7:00 PM' }
            };

            validateMinistry(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: 'Validation error',
                    details: expect.arrayContaining([
                        expect.objectContaining({
                            field: 'parishId',
                            message: expect.stringContaining('required')
                        })
                    ])
                })
            );
            expect(next).not.toHaveBeenCalled();
        });

        it('should set default values for optional fields', () => {
            req.body = {
                name: 'Test Ministry',
                type: 'BIBLE_STUDY',
                ageGroups: ['ADULTS'],
                languages: ['en'],
                schedule: { weekly: 'Wednesday 7:00 PM' },
                parishId: 'test-parish-id'
            };

            validateMinistry(req as Request, res as Response, next);

            expect(req.body.isOngoing).toBe(true);
            expect(req.body.requiresRegistration).toBe(false);
            expect(req.body.isAccessible).toBe(true);
            expect(req.body.requirements).toEqual([]);
            expect(req.body.materials).toEqual([]);
            expect(req.body.isActive).toBe(true);
            expect(req.body.isPublic).toBe(true);
        });
    });

    describe('checkDuplicateMinistry', () => {
        let dioceseId: string;
        let parishId: string;

        beforeEach(async () => {
            const diocese = await createTestDiocese();
            dioceseId = diocese.id;

            const parish = await createTestParish(dioceseId);
            parishId = parish.id;
        });

        it('should pass when ministry name is unique in parish', async () => {
            req.body = {
                name: 'Unique Ministry Name',
                parishId
            };

            await checkDuplicateMinistry(req as Request, res as Response, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        it('should fail when ministry name already exists in parish', async () => {
            // Create existing ministry
            await createTestMinistry(parishId, { name: 'Existing Ministry' });

            req.body = {
                name: 'Existing Ministry',
                parishId
            };

            await checkDuplicateMinistry(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Duplicate ministry',
                message: 'A ministry with the name "Existing Ministry" already exists in this parish'
            });
            expect(next).not.toHaveBeenCalled();
        });

        it('should pass when updating ministry without changing name', async () => {
            // Create existing ministry
            const ministry = await createTestMinistry(parishId, { name: 'Test Ministry' });

            req.body = {
                name: 'Test Ministry',
                parishId
            };
            req.params = {
                id: ministry.id
            };

            await checkDuplicateMinistry(req as Request, res as Response, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        it('should fail when updating ministry to conflicting name', async () => {
            // Create two ministries
            const ministry1 = await createTestMinistry(parishId, { name: 'Ministry One' });
            const ministry2 = await createTestMinistry(parishId, { name: 'Ministry Two' });

            req.body = {
                name: 'Ministry One', // Trying to use name of ministry1
                parishId
            };
            req.params = {
                id: ministry2.id // Updating ministry2
            };

            await checkDuplicateMinistry(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Duplicate ministry',
                message: 'A ministry with the name "Ministry One" already exists in this parish'
            });
            expect(next).not.toHaveBeenCalled();
        });

        it('should handle whitespace properly (trim names)', async () => {
            // Create ministry with name that has whitespace
            await createTestMinistry(parishId, { name: 'Spaced Ministry' });

            req.body = {
                name: '  Spaced Ministry  ', // Same name with whitespace
                parishId
            };

            await checkDuplicateMinistry(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(next).not.toHaveBeenCalled();
        });

        it('should allow same name in different parishes', async () => {
            // Create ministry in first parish
            await createTestMinistry(parishId, { name: 'Common Ministry' });

            // Create second parish
            const secondParish = await createTestParish(dioceseId, { name: 'Second Parish' });

            req.body = {
                name: 'Common Ministry',
                parishId: secondParish.id
            };

            await checkDuplicateMinistry(req as Request, res as Response, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        it('should handle database errors gracefully', async () => {
            // Mock prisma to throw an error
            const originalFindFirst = prisma.ministry.findFirst;
            prisma.ministry.findFirst = jest.fn().mockRejectedValue(new Error('Database error'));

            req.body = {
                name: 'Test Ministry',
                parishId
            };

            await checkDuplicateMinistry(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Internal server error'
            });
            expect(next).not.toHaveBeenCalled();

            // Restore original function
            prisma.ministry.findFirst = originalFindFirst;
        });
    });
});