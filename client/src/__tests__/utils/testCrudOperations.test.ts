import { crudTester, runQuickCrudTest } from './testCrudOperations';

// Mock the API
/* eslint-disable testing-library/no-await-sync-query */
jest.mock('../../services/api', () => ({
    ministryApi: {
        create: jest.fn(),
        getById: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        getAll: jest.fn(),
    },
    parishApi: {
        getAll: jest.fn(),
    },
}));
/* eslint-enable testing-library/no-await-sync-query */describe('CRUD Test Utilities', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Clear console logs
        jest.spyOn(console, 'log').mockImplementation(() => { });
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('CrudTester', () => {
        it('should be exported as a singleton', () => {
            expect(crudTester).toBeDefined();
            expect(typeof crudTester.testCreate).toBe('function');
            expect(typeof crudTester.testRead).toBe('function');
            expect(typeof crudTester.testUpdate).toBe('function');
            expect(typeof crudTester.testDelete).toBe('function');
            expect(typeof crudTester.runFullCrudTest).toBe('function');
        });

        it('should have all required testing methods', () => {
            const methods = [
                'testCreate',
                'testRead',
                'testUpdate',
                'testDelete',
                'runFullCrudTest',
                'testReadAll'
            ];

            methods.forEach(method => {
                expect(crudTester).toHaveProperty(method);
                expect(typeof (crudTester as any)[method]).toBe('function');
            });
        });
    });

    describe('runQuickCrudTest', () => {
        it('should be exported as a function', () => {
            expect(runQuickCrudTest).toBeDefined();
            expect(typeof runQuickCrudTest).toBe('function');
        });
    });

    describe('Browser integration', () => {
        it('should expose functions to global window object', () => {
            // Simulate browser environment
            const mockWindow = {
                runQuickCrudTest: undefined,
                crudTester: undefined,
            };

            // Mock window object
            Object.defineProperty(global, 'window', {
                value: mockWindow,
                writable: true,
            });

            // Re-import the module to trigger the window assignment
            jest.resetModules();
            require('../testCrudOperations');

            expect(mockWindow.runQuickCrudTest).toBeDefined();
            expect(mockWindow.crudTester).toBeDefined();
        });
    });
});