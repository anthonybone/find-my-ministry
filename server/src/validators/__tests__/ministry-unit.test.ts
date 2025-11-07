import { validateMinistry } from '../ministry';
import { Request, Response, NextFunction } from 'express';

describe('Ministry Validation (Unit Tests)', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it('should validate a correct ministry object', () => {
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

    it('should reject ministry with missing name', () => {
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
                error: 'Validation error'
            })
        );
        expect(next).not.toHaveBeenCalled();
    });

    it('should reject ministry with invalid type', () => {
        req.body = {
            name: 'Test Ministry',
            type: 'INVALID_TYPE',
            ageGroups: ['ADULTS'],
            languages: ['en'],
            schedule: { weekly: 'Wednesday 7:00 PM' },
            parishId: 'test-parish-id'
        };

        validateMinistry(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(next).not.toHaveBeenCalled();
    });

    it('should set default values for optional boolean fields', () => {
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
        expect(req.body.isActive).toBe(true);
        expect(req.body.isPublic).toBe(true);
        expect(next).toHaveBeenCalled();
    });
});