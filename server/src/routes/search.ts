import { Router } from 'express';
import { prisma } from '../index';

const router = Router();

// GET /api/search - Global search across ministries, parishes, and dioceses
router.get('/', async (req, res) => {
    try {
        const {
            q: query,
            type,
            location,
            ageGroups,
            languages,
            limit = '20'
        } = req.query;

        if (!query || typeof query !== 'string') {
            return res.status(400).json({ error: 'Search query is required' });
        }

        const searchResults: any = {
            ministries: [],
            parishes: [],
            totalResults: 0
        };

        // Search ministries
        const ministryWhere: any = {
            isActive: true,
            isPublic: true,
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
                { parish: { name: { contains: query, mode: 'insensitive' } } },
                { parish: { city: { contains: query, mode: 'insensitive' } } }
            ]
        };

        if (type && typeof type === 'string') {
            ministryWhere.type = type;
        }

        if (ageGroups && typeof ageGroups === 'string') {
            const ageGroupArray = ageGroups.split(',');
            ministryWhere.ageGroups = {
                hasSome: ageGroupArray
            };
        }

        if (languages && typeof languages === 'string') {
            const languageArray = languages.split(',');
            ministryWhere.languages = {
                hasSome: languageArray
            };
        }

        if (location && typeof location === 'string') {
            ministryWhere.parish = {
                OR: [
                    { city: { contains: location, mode: 'insensitive' } },
                    { address: { contains: location, mode: 'insensitive' } },
                    { zipCode: { contains: location, mode: 'insensitive' } }
                ]
            };
        }

        const ministries = await prisma.ministry.findMany({
            where: ministryWhere,
            include: {
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
                        diocese: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            },
            take: Math.min(parseInt(limit as string), 50),
            orderBy: { name: 'asc' }
        });

        // Search parishes
        const parishWhere: any = {
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { address: { contains: query, mode: 'insensitive' } },
                { city: { contains: query, mode: 'insensitive' } }
            ]
        };

        if (location && typeof location === 'string') {
            parishWhere.OR = [
                { city: { contains: location, mode: 'insensitive' } },
                { address: { contains: location, mode: 'insensitive' } },
                { zipCode: { contains: location, mode: 'insensitive' } }
            ];
        }

        const parishes = await prisma.parish.findMany({
            where: parishWhere,
            include: {
                diocese: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                _count: {
                    select: {
                        ministries: {
                            where: {
                                isActive: true,
                                isPublic: true
                            }
                        }
                    }
                }
            },
            take: Math.min(parseInt(limit as string), 20),
            orderBy: { name: 'asc' }
        });

        searchResults.ministries = ministries;
        searchResults.parishes = parishes;
        searchResults.totalResults = ministries.length + parishes.length;

        res.json(searchResults);
    } catch (error) {
        console.error('Error performing search:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/search/suggestions - Get search suggestions
router.get('/suggestions', async (req, res) => {
    try {
        const { q: query } = req.query;

        if (!query || typeof query !== 'string' || query.length < 2) {
            return res.json({ suggestions: [] });
        }

        // Get ministry name suggestions
        const ministryNames = await prisma.ministry.findMany({
            where: {
                isActive: true,
                isPublic: true,
                name: {
                    contains: query,
                    mode: 'insensitive'
                }
            },
            select: {
                name: true
            },
            take: 5,
            distinct: ['name']
        });

        // Get parish name suggestions
        const parishNames = await prisma.parish.findMany({
            where: {
                name: {
                    contains: query,
                    mode: 'insensitive'
                }
            },
            select: {
                name: true
            },
            take: 5,
            distinct: ['name']
        });

        // Get city suggestions
        const cities = await prisma.parish.findMany({
            where: {
                city: {
                    contains: query,
                    mode: 'insensitive'
                }
            },
            select: {
                city: true,
                state: true
            },
            take: 5,
            distinct: ['city']
        });

        const suggestions = [
            ...ministryNames.map(m => ({ type: 'ministry', text: m.name })),
            ...parishNames.map(p => ({ type: 'parish', text: p.name })),
            ...cities.map(c => ({ type: 'location', text: `${c.city}, ${c.state}` }))
        ];

        res.json({ suggestions: suggestions.slice(0, 10) });
    } catch (error) {
        console.error('Error getting search suggestions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;