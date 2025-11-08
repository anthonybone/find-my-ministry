import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// GET /api/parishes - Get all parishes with optional filters
router.get('/', async (req, res) => {
    try {
        const {
            dioceseId,
            city,
            state,
            zipCode,
            search,
            limit = '50',
            offset = '0'
        } = req.query;

        const where: any = {};

        if (dioceseId && typeof dioceseId === 'string') {
            where.dioceseId = dioceseId;
        }

        if (city && typeof city === 'string') {
            where.city = { contains: city, mode: 'insensitive' };
        }

        if (state && typeof state === 'string') {
            where.state = state;
        }

        if (zipCode && typeof zipCode === 'string') {
            where.zipCode = zipCode;
        }

        if (search && typeof search === 'string') {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { address: { contains: search, mode: 'insensitive' } },
                { city: { contains: search, mode: 'insensitive' } }
            ];
        }

        const parishes = await prisma.parish.findMany({
            where,
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
            orderBy: { name: 'asc' },
            take: parseInt(limit as string),
            skip: parseInt(offset as string)
        });

        const total = await prisma.parish.count({ where });

        res.json({
            parishes,
            pagination: {
                total,
                limit: parseInt(limit as string),
                offset: parseInt(offset as string),
                hasMore: total > parseInt(offset as string) + parseInt(limit as string)
            }
        });
    } catch (error) {
        console.error('Error fetching parishes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/parishes/:id - Get parish by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const parish = await prisma.parish.findUnique({
            where: { id },
            include: {
                diocese: true,
                ministries: {
                    where: {
                        isActive: true,
                        isPublic: true
                    },
                    orderBy: { name: 'asc' }
                }
            }
        });

        if (!parish) {
            return res.status(404).json({ error: 'Parish not found' });
        }

        res.json(parish);
    } catch (error) {
        console.error('Error fetching parish:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/parishes/:id/ministries - Get ministries for a parish
router.get('/:id/ministries', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            type,
            ageGroups,
            languages,
            isActive = 'true',
            isPublic = 'true'
        } = req.query;

        const where: any = {
            parishId: id,
            isActive: isActive === 'true',
            isPublic: isPublic === 'true',
        };

        if (type && typeof type === 'string') {
            where.type = type;
        }

        if (ageGroups && typeof ageGroups === 'string') {
            const ageGroupArray = ageGroups.split(',');
            where.ageGroups = {
                hasSome: ageGroupArray
            };
        }

        if (languages && typeof languages === 'string') {
            const languageArray = languages.split(',');
            where.languages = {
                hasSome: languageArray
            };
        }

        const ministries = await prisma.ministry.findMany({
            where,
            include: {
                parish: {
                    select: {
                        id: true,
                        name: true,
                        city: true,
                        state: true
                    }
                }
            },
            orderBy: { name: 'asc' }
        });

        res.json(ministries);
    } catch (error) {
        console.error('Error fetching parish ministries:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;