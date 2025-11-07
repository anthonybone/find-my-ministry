import { createCheckDuplicateMinistry } from '../ministry';
import { Request, Response, NextFunction } from 'express';

// Mock Prisma client
const mockPrismaClient = {
    ministry: {
        findFirst: jest.fn()
    }
};

describe('Duplicate Ministry Check (Unit Tests)', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;
    let checkDuplicateMinistry: any;

    beforeAll(() => {
        checkDuplicateMinistry = createCheckDuplicateMinistry(mockPrismaClient as any);
    });

    beforeEach(() => {
        req = {
            body: {
                name: 'Test Ministry',
                parishId: 'test-parish-id'
            },
            params: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    it('should allow creation when no duplicate exists', async () => {
        mockPrismaClient.ministry.findFirst.mockResolvedValue(null);

        await checkDuplicateMinistry(req as Request, res as Response, next);

        expect(mockPrismaClient.ministry.findFirst).toHaveBeenCalledWith({
            where: {
                name: {
                    equals: 'Test Ministry',
                    mode: 'insensitive'
                },
                parishId: 'test-parish-id'
            }
        });
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it('should prevent creation when duplicate exists', async () => {
        const existingMinistry = { id: 'existing-id', name: 'Test Ministry' };
        mockPrismaClient.ministry.findFirst.mockResolvedValue(existingMinistry);

        await checkDuplicateMinistry(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Duplicate ministry',
            message: 'A ministry with the name "Test Ministry" already exists in this parish'
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should trim whitespace from ministry name', async () => {
        req.body.name = '  Test Ministry  ';
        mockPrismaClient.ministry.findFirst.mockResolvedValue(null);

        await checkDuplicateMinistry(req as Request, res as Response, next);

        expect(mockPrismaClient.ministry.findFirst).toHaveBeenCalledWith({
            where: {
                name: {
                    equals: 'Test Ministry',
                    mode: 'insensitive'
                },
                parishId: 'test-parish-id'
            }
        });
    });

    it('should exclude current ministry ID when updating', async () => {
        req.params = { id: 'current-ministry-id' };
        mockPrismaClient.ministry.findFirst.mockResolvedValue(null);

        await checkDuplicateMinistry(req as Request, res as Response, next);

        expect(mockPrismaClient.ministry.findFirst).toHaveBeenCalledWith({
            where: {
                name: {
                    equals: 'Test Ministry',
                    mode: 'insensitive'
                },
                parishId: 'test-parish-id',
                NOT: { id: 'current-ministry-id' }
            }
        });
    });

    it('should handle database errors gracefully', async () => {
        const dbError = new Error('Database connection failed');
        mockPrismaClient.ministry.findFirst.mockRejectedValue(dbError);

        await checkDuplicateMinistry(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Internal server error'
        });
        expect(next).not.toHaveBeenCalled();
    });
});