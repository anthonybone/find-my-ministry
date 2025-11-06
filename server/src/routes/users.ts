import { Router } from 'express';
import { prisma } from '../index';

const router = Router();

// GET /api/users - Get all users (admin only)
router.get('/', async (req, res) => {
    try {
        // In a real app, you'd check authentication and authorization here
        const users = await prisma.user.findMany({
            orderBy: { name: 'asc' }
        });

        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/users/:id - Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/users - Create new user
router.post('/', async (req, res) => {
    try {
        const { email, name, role = 'USER' } = req.body;

        if (!email || !name) {
            return res.status(400).json({ error: 'Email and name are required' });
        }

        const user = await prisma.user.create({
            data: {
                email,
                name,
                role
            }
        });

        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        if (error instanceof Error && (error as any).code === 'P2002') {
            res.status(400).json({ error: 'User with this email already exists' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

// PUT /api/users/:id - Update user
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { email, name, role } = req.body;

        const user = await prisma.user.update({
            where: { id },
            data: {
                ...(email && { email }),
                ...(name && { name }),
                ...(role && { role })
            }
        });

        res.json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        if (error instanceof Error && (error as any).code === 'P2025') {
            res.status(404).json({ error: 'User not found' });
        } else if (error instanceof Error && (error as any).code === 'P2002') {
            res.status(400).json({ error: 'Email already in use' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.user.delete({
            where: { id }
        });

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting user:', error);
        if (error instanceof Error && (error as any).code === 'P2025') {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

export default router;