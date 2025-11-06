import { Router } from 'express';
import { prisma } from '../index';
import { validateMinistry } from '../validators/ministry';

const router = Router();

// GET /api/ministries - Get all ministries with optional filters
router.get('/', async (req, res) => {
    try {
        const {
            parishId,
            type,
            ageGroups,
            languages,
            isActive = 'true',
            isPublic = 'true',
            search,
            limit = '50',
            offset = '0'
        } = req.query;

        const where: any = {
            isActive: isActive === 'true',
            isPublic: isPublic === 'true',
        };

        if (parishId && typeof parishId === 'string') {
            where.parishId = parishId;
        }

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

        if (search && typeof search === 'string') {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { parish: { name: { contains: search, mode: 'insensitive' } } }
            ];
        }

        const ministries = await prisma.ministry.findMany({
            where,
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
            },
            orderBy: { name: 'asc' },
            take: parseInt(limit as string),
            skip: parseInt(offset as string)
        });

        const total = await prisma.ministry.count({ where });

        res.json({
            ministries,
            pagination: {
                total,
                limit: parseInt(limit as string),
                offset: parseInt(offset as string),
                hasMore: total > parseInt(offset as string) + parseInt(limit as string)
            }
        });
    } catch (error) {
        console.error('Error fetching ministries:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/ministries/:id - Get ministry by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const ministry = await prisma.ministry.findUnique({
            where: { id },
            include: {
                parish: {
                    include: {
                        diocese: true
                    }
                }
            }
        });

        if (!ministry) {
            return res.status(404).json({ error: 'Ministry not found' });
        }

        res.json(ministry);
    } catch (error) {
        console.error('Error fetching ministry:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/ministries - Create new ministry
router.post('/', validateMinistry, async (req, res) => {
    try {
        const ministry = await prisma.ministry.create({
            data: req.body,
            include: {
                parish: {
                    include: {
                        diocese: true
                    }
                }
            }
        });

        res.status(201).json(ministry);
    } catch (error) {
        console.error('Error creating ministry:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /api/ministries/:id - Update ministry
router.put('/:id', validateMinistry, async (req, res) => {
    try {
        const { id } = req.params;

        const ministry = await prisma.ministry.update({
            where: { id },
            data: req.body,
            include: {
                parish: {
                    include: {
                        diocese: true
                    }
                }
            }
        });

        res.json(ministry);
    } catch (error) {
        console.error('Error updating ministry:', error);
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Ministry not found' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

// DELETE /api/ministries/:id - Delete ministry
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.ministry.delete({
            where: { id }
        });

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting ministry:', error);
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Ministry not found' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

// GET /api/ministries/types - Get all ministry types
router.get('/meta/types', (req, res) => {
    const types = [
        'YOUTH_MINISTRY',
        'YOUNG_ADULT',
        'ADULT_EDUCATION',
        'BIBLE_STUDY',
        'PRAYER_GROUP',
        'CHOIR_MUSIC',
        'LITURGICAL_MINISTRY',
        'SOCIAL_JUSTICE',
        'COMMUNITY_SERVICE',
        'FOOD_PANTRY',
        'SENIORS_MINISTRY',
        'MENS_GROUP',
        'WOMENS_GROUP',
        'MARRIAGE_FAMILY',
        'BEREAVEMENT',
        'ADDICTION_RECOVERY',
        'RELIGIOUS_EDUCATION',
        'RCIA',
        'CONFIRMATION_PREP',
        'FIRST_COMMUNION_PREP',
        'BAPTISM_PREP',
        'MARRIAGE_PREP',
        'KNIGHTS_OF_COLUMBUS',
        'ALTAR_SOCIETY',
        'ST_VINCENT_DE_PAUL',
        'PASTORAL_CARE',
        'HOSPITALITY',
        'MAINTENANCE_GROUNDS',
        'FUNDRAISING',
        'RETREAT_MINISTRY',
        'MISSION_OUTREACH',
        'OTHER'
    ];

    res.json(types);
});

// GET /api/ministries/meta/age-groups - Get all age groups
router.get('/meta/age-groups', (req, res) => {
    const ageGroups = [
        'CHILDREN',
        'TEENAGERS',
        'YOUNG_ADULTS',
        'ADULTS',
        'SENIORS',
        'FAMILIES',
        'ALL_AGES'
    ];

    res.json(ageGroups);
});

export default router;