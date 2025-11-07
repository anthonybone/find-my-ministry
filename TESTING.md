# Testing Organization Documentation

## Overview
This document describes the testing organization and structure for the Find My Ministry application.

## Testing Structure

### Server-Side Tests (`/server/src/`)

The server-side tests are organized using a **co-located approach** where tests are placed in `__tests__` folders next to the code they test:

```
server/src/
├── validators/
│   ├── ministry.ts
│   └── __tests__/
│       ├── ministry.test.ts                 # Integration tests
│       ├── ministry-unit.test.ts           # Unit tests
│       └── duplicate-check-unit.test.ts    # Specific unit tests
├── routes/
│   ├── ministries.ts
│   └── __tests__/
│       └── ministries.test.ts              # Route tests
└── __tests__/
    └── utils/
        └── testHelpers.ts                   # Shared test utilities
```

**Benefits of this approach:**
- Tests are close to the code they test
- Easy to find relevant tests
- Clear ownership and responsibility
- Follows Jest best practices

### Client-Side Tests (`/client/src/`)

The client-side tests follow a similar co-located structure:

```
client/src/
├── components/
│   ├── MinistryCard.tsx
│   └── __tests__/
│       ├── MinistryCard.test.tsx           # Component tests
│       └── CrudTestPanel.tsx               # Development testing component
├── utils/
│   ├── ministryUtils.ts
│   └── __tests__/
│       └── ministryUtils.test.ts           # Utility tests
└── __tests__/
    └── utils/
        └── testCrudOperations.ts            # CRUD testing utilities
```

### Legacy Test Structure (`/server/tests/`)

The old centralized test structure still exists for integration tests and will be gradually migrated:

```
server/tests/
├── integration/
│   └── ministry-api.test.ts                # Full API integration tests
└── utils/
    └── testHelpers.ts                       # Legacy test helpers (to be deprecated)
```

## Test Categories

### 1. Unit Tests
- **Location**: Co-located with source code in `__tests__` folders
- **Purpose**: Test individual functions, classes, or components in isolation
- **Naming**: `*.unit.test.ts` or `*.test.ts`
- **Examples**: 
  - `ministry-unit.test.ts` - Tests individual validator functions
  - `duplicate-check-unit.test.ts` - Tests specific duplicate checking logic

### 2. Integration Tests
- **Location**: Co-located or in `/server/tests/integration/`
- **Purpose**: Test interactions between multiple components
- **Naming**: `*.test.ts` or `*-integration.test.ts`
- **Examples**:
  - `ministry.test.ts` - Tests validator + database interactions
  - `ministry-api.test.ts` - Tests full API workflows

### 3. Development/Demo Tests
- **Location**: `client/src/__tests__/utils/` and `client/src/components/__tests__/`
- **Purpose**: Interactive testing for development and debugging
- **Files**:
  - `testCrudOperations.ts` - CRUD testing utilities
  - `CrudTestPanel.tsx` - UI component for running tests in browser

## Test Utilities

### Server Test Helpers
```typescript
// server/src/__tests__/utils/testHelpers.ts
export const getTestPrismaClient = () => { /* ... */ }
export const createTestDiocese = (overrides?) => { /* ... */ }
export const createTestParish = (dioceseId, overrides?) => { /* ... */ }
export const createTestMinistry = (parishId, overrides?) => { /* ... */ }
export const cleanupTestData = () => { /* ... */ }
```

### Client Test Utilities
```typescript
// client/src/__tests__/utils/testCrudOperations.ts
export class CrudTester {
  testCreate(parishId: string): Promise<Ministry | null>
  testRead(ministryId: string): Promise<Ministry | null>
  testUpdate(ministryId: string): Promise<Ministry | null>
  testDelete(ministryId: string): Promise<boolean>
  runFullCrudTest(parishId: string): Promise<void>
}
```

## Running Tests

### Server Tests
```bash
cd server
npm test                    # Run all tests
npm test -- --watch        # Run in watch mode
npm test ministry          # Run specific test files
npm run test:coverage      # Run with coverage
```

### Client Tests
```bash
cd client
npm test                    # Run all tests
npm test -- --watch        # Run in watch mode
```

### Development Testing
- **Browser Console**: Open browser dev tools and run `runQuickCrudTest()`
- **CRUD Test Panel**: Available in development mode on the home page

## Best Practices

### 1. Test Organization
- ✅ Place tests in `__tests__` folders next to source code
- ✅ Use descriptive test file names
- ✅ Group related tests in describe blocks
- ✅ Keep test utilities separate and shared

### 2. Test Naming
- Unit tests: `component.test.ts` or `component.unit.test.ts`
- Integration tests: `component.integration.test.ts`
- End-to-end tests: `component.e2e.test.ts`

### 3. Test Structure
```typescript
describe('ComponentName', () => {
  describe('methodName', () => {
    it('should handle normal case', () => {
      // Arrange
      // Act
      // Assert
    });
    
    it('should handle edge case', () => {
      // Test implementation
    });
    
    it('should handle error case', () => {
      // Test implementation
    });
  });
});
```

### 4. Test Data
- Use factory functions for creating test data
- Isolate tests from each other
- Clean up after tests
- Use meaningful test data that reflects real usage

### 5. Mocking
- Mock external dependencies
- Use Jest's built-in mocking features
- Keep mocks simple and focused

## Migration Plan

### Phase 1: ✅ Complete
- Move validator tests to co-located structure
- Move route tests to co-located structure
- Move client testing utilities to proper structure
- Update import statements

### Phase 2: In Progress
- Add component tests for React components
- Add utility function tests
- Create service layer tests

### Phase 3: Future
- Add end-to-end tests with Playwright or Cypress
- Add visual regression tests
- Add performance tests

## Configuration

### Jest Configuration (Server)
```javascript
// server/jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/__tests__/**/*.ts', // Exclude test files
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
};
```

## Tools and Libraries

### Testing Framework
- **Jest**: Main testing framework for both client and server
- **TypeScript**: Full TypeScript support in tests

### Server Testing
- **Supertest**: HTTP integration testing
- **Prisma Test Client**: Database testing
- **Jest**: Mocking and assertions

### Client Testing
- **React Testing Library**: Component testing
- **Jest DOM**: Additional matchers for DOM testing

### Development Testing
- **Custom CRUD Tester**: Interactive testing utilities
- **Browser Console Integration**: Quick testing from browser

## Troubleshooting

### Common Issues
1. **Import Path Errors**: Make sure to use relative paths correctly after reorganization
2. **Test Database**: Ensure test database is properly configured
3. **Async Tests**: Remember to await async operations and handle promises
4. **Test Isolation**: Each test should be independent and not rely on other tests

### Debug Tips
- Use `console.log` in tests for debugging
- Run single test files with `npm test -- fileName`
- Use `--verbose` flag for detailed output
- Check test setup files for configuration issues