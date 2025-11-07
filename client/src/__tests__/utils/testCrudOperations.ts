/**
 * Test utility to demonstrate and verify CRUD operations for ministries
 * This file is for development testing purposes only
 */

import { ministryApi, Ministry, AgeGroup } from '../../services/api';

// Test data for creating a ministry
const testMinistryData = {
    name: 'Test Ministry - CRUD Demo',
    description: 'This is a test ministry created to demonstrate CRUD operations. It will be deleted after testing.',
    type: 'OTHER' as const,
    ageGroups: ['ADULTS'] as AgeGroup[],
    languages: ['English'],
    parishId: '',
    schedule: {
        dayOfWeek: 'SUNDAY',
        time: '10:00 AM',
        frequency: 'WEEKLY'
    },
    isOngoing: true,
    contactEmail: 'test@example.com',
    requiresRegistration: false,
    isAccessible: true,
    requirements: [],
    materials: [],
    isActive: true,
    isPublic: true
};

export class CrudTester {
    private createdMinistryId: string | null = null;

    /**
     * Test CREATE operation
     */
    async testCreate(parishId: string): Promise<Ministry | null> {
        try {
            console.log('🟡 Testing CREATE operation...');
            const ministryToCreate = {
                ...testMinistryData,
                parishId,
                name: `Test Ministry - CRUD Demo ${new Date().getTime()}`
            };

            const createdMinistry = await ministryApi.create(ministryToCreate);
            this.createdMinistryId = createdMinistry.id;
            console.log('✅ CREATE successful:', createdMinistry);
            return createdMinistry;
        } catch (error) {
            console.error('❌ CREATE failed:', error);
            return null;
        }
    }

    /**
     * Test READ operation
     */
    async testRead(ministryId: string): Promise<Ministry | null> {
        try {
            console.log('🟡 Testing READ operation...');
            const ministry = await ministryApi.getById(ministryId);
            console.log('✅ READ successful:', ministry);
            return ministry;
        } catch (error) {
            console.error('❌ READ failed:', error);
            return null;
        }
    }

    /**
     * Test UPDATE operation
     */
    async testUpdate(ministryId: string): Promise<Ministry | null> {
        try {
            console.log('🟡 Testing UPDATE operation...');
            const updateData = {
                name: 'Updated Test Ministry - CRUD Demo',
                description: 'This ministry has been updated to test the UPDATE operation.',
                type: 'OTHER' as const
            };

            const updatedMinistry = await ministryApi.update(ministryId, updateData);
            console.log('✅ UPDATE successful:', updatedMinistry);
            return updatedMinistry;
        } catch (error) {
            console.error('❌ UPDATE failed:', error);
            return null;
        }
    }

    /**
     * Test DELETE operation
     */
    async testDelete(ministryId: string): Promise<boolean> {
        try {
            console.log('🟡 Testing DELETE operation...');
            await ministryApi.delete(ministryId);
            console.log('✅ DELETE successful');

            // Verify deletion by trying to read the ministry
            try {
                await ministryApi.getById(ministryId);
                console.log('❌ DELETE verification failed - ministry still exists');
                return false;
            } catch (readError) {
                console.log('✅ DELETE verified - ministry no longer exists');
                return true;
            }
        } catch (error) {
            console.error('❌ DELETE failed:', error);
            return false;
        }
    }

    /**
     * Run all CRUD operations in sequence
     */
    async runFullCrudTest(parishId: string): Promise<void> {
        console.log('🚀 Starting Full CRUD Test...');
        console.log('=====================================');

        // CREATE
        const createdMinistry = await this.testCreate(parishId);
        if (!createdMinistry) {
            console.log('❌ Test aborted - CREATE failed');
            return;
        }

        const ministryId = createdMinistry.id;

        // READ
        const readMinistry = await this.testRead(ministryId);
        if (!readMinistry) {
            console.log('⚠️ READ failed, but continuing with test...');
        }

        // UPDATE
        const updatedMinistry = await this.testUpdate(ministryId);
        if (!updatedMinistry) {
            console.log('⚠️ UPDATE failed, but continuing with test...');
        }

        // READ again to verify update
        if (updatedMinistry) {
            console.log('🟡 Reading updated ministry to verify changes...');
            const verifyReadMinistry = await this.testRead(ministryId);
            if (verifyReadMinistry && verifyReadMinistry.name === updatedMinistry.name) {
                console.log('✅ UPDATE verification successful');
            } else {
                console.log('❌ UPDATE verification failed');
            }
        }

        // DELETE
        const deleteSuccess = await this.testDelete(ministryId);
        if (!deleteSuccess) {
            console.log('⚠️ DELETE failed - you may need to manually clean up the test ministry');
        }

        console.log('=====================================');
        console.log('🏁 Full CRUD Test Complete!');
    }

    /**
     * Test READ ALL operation
     */
    async testReadAll(): Promise<void> {
        try {
            console.log('🟡 Testing READ ALL operation...');
            const result = await ministryApi.getAll({ limit: 5 });
            console.log('✅ READ ALL successful. Found', result.ministries.length, 'ministries');
            console.log('📊 Pagination info:', result.pagination);
        } catch (error) {
            console.error('❌ READ ALL failed:', error);
        }
    }
}

// Export a singleton instance for easy testing
export const crudTester = new CrudTester();

// Helper function to run a quick test from browser console
export const runQuickCrudTest = async (parishId?: string) => {
    if (!parishId) {
        // Try to get the first parish ID from the API
        try {
            console.log('🔍 Finding a parish to use for testing...');
            const { parishApi } = await import('../../services/api');
            const parishesResult = await parishApi.getAll({ search: '' });
            if (parishesResult.parishes.length > 0) {
                parishId = parishesResult.parishes[0].id;
                console.log('📍 Using parish:', parishesResult.parishes[0].name);
            } else {
                console.error('❌ No parishes found. Cannot run CRUD test.');
                return;
            }
        } catch (error) {
            console.error('❌ Failed to fetch parishes:', error);
            return;
        }
    }

    // Test READ ALL first
    await crudTester.testReadAll();

    // Run full CRUD test
    await crudTester.runFullCrudTest(parishId);
};

// Make it available globally for browser console testing
if (typeof window !== 'undefined') {
    (window as any).runQuickCrudTest = runQuickCrudTest;
    (window as any).crudTester = crudTester;
}