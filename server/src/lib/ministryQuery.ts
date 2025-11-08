import { Prisma, AgeGroup, MinistryType } from '@prisma/client';

/**
 * Query builder for ministry filtering
 */

export interface MinistryQueryFilters {
    parishId?: string;
    type?: MinistryType;
    ageGroups?: AgeGroup[];
    languages?: string[];
    isActive?: boolean;
    isPublic?: boolean;
    search?: string;
    includePlaceholders?: boolean;
}

export interface PaginationOptions {
    limit: number;
    offset: number;
}

export class MinistryQueryBuilder {
    private where: Prisma.MinistryWhereInput = {};

    static fromFilters(filters: MinistryQueryFilters): MinistryQueryBuilder {
        const builder = new MinistryQueryBuilder();
        
        // Basic filters
        if (filters.parishId) {
            builder.where.parishId = filters.parishId;
        }

        if (filters.type) {
            builder.where.type = filters.type;
        }

        // Array filters
        if (filters.ageGroups?.length) {
            builder.where.ageGroups = {
                hasSome: filters.ageGroups
            };
        }

        if (filters.languages?.length) {
            builder.where.languages = {
                hasSome: filters.languages
            };
        }

        // Boolean filters  
        builder.where.isActive = filters.isActive ?? true;
        builder.where.isPublic = filters.isPublic ?? true;

        // Search filter
        if (filters.search) {
            builder.addSearchFilter(filters.search);
        }

        // Placeholder filter
        if (!filters.includePlaceholders) {
            builder.addPlaceholderFilter();
        }

        return builder;
    }

    private addSearchFilter(searchTerm: string): void {
        this.where.OR = [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
            { parish: { name: { contains: searchTerm, mode: 'insensitive' } } }
        ];
    }

    private addPlaceholderFilter(): void {
        this.where.AND = [
            { name: { not: { contains: '[PLACEHOLDER]' } } },
            { name: { not: { contains: 'FAKE' } } },
            { contactEmail: { not: { contains: 'PLACEHOLDER@example.com' } } }
        ];
    }

    build(): Prisma.MinistryWhereInput {
        return this.where;
    }
}

/**
 * Standard include options for ministry queries
 */
export const getMinistryInclude = (): Prisma.MinistryInclude => ({
    parish: {
        select: {
            id: true,
            name: true,
            address: true,
            city: true,
            state: true,
            zipCode: true,
            latitude: true,
            longitude: true,
            phone: true,
            email: true,
            website: true,
            diocese: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    }
});

/**
 * Sort ministries to prioritize real ministries over placeholders
 */
export const sortMinistriesByRelevance = (ministries: any[]): any[] => {
    return ministries.sort((a, b) => {
        // Sort non-placeholder ministries first
        const aIsPlaceholder = a.name.includes('[PLACEHOLDER]') || 
                              a.name.includes('FAKE') || 
                              a.contactEmail?.includes('PLACEHOLDER@example.com');
        const bIsPlaceholder = b.name.includes('[PLACEHOLDER]') || 
                              b.name.includes('FAKE') || 
                              b.contactEmail?.includes('PLACEHOLDER@example.com');

        if (aIsPlaceholder && !bIsPlaceholder) return 1;
        if (!aIsPlaceholder && bIsPlaceholder) return -1;
        
        // Then sort by name alphabetically
        return a.name.localeCompare(b.name);
    });
};