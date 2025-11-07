import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// GET /api/dioceses - Get all dioceses
router.get('/', async (req, res) => {
    try {
        const dioceses = await prisma.diocese.findMany({
            include: {
                _count: {
                    select: {
                        parishes: true
                    }
                }
            },
            orderBy: { name: 'asc' }
        });

        res.json(dioceses);
    } catch (error) {
        console.error('Error fetching dioceses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/dioceses/:id - Get diocese by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const diocese = await prisma.diocese.findUnique({
            where: { id },
            include: {
                parishes: {
                    select: {
                        id: true,
                        name: true,
                        city: true,
                        state: true,
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
                    orderBy: { name: 'asc' }
                }
            }
        });

        if (!diocese) {
            return res.status(404).json({ error: 'Diocese not found' });
        }

        res.json(diocese);
    } catch (error) {
        console.error('Error fetching diocese:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/dioceses/:id/parishes - Get parishes for a diocese
router.get('/:id/parishes', async (req, res) => {
    try {
        const { id } = req.params;
        const { limit = '50', offset = '0' } = req.query;

        const parishes = await prisma.parish.findMany({
            where: { dioceseId: id },
            include: {
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

        const total = await prisma.parish.count({
            where: { dioceseId: id }
        });

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
        console.error('Error fetching diocese parishes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;