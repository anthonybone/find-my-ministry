import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const ministrySchema = Joi.object({
    name: Joi.string().required().min(1).max(200),
    description: Joi.string().optional().max(1000),
    type: Joi.string().required().valid(
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
        'TEST',
        'OTHER'
    ),
    ageGroups: Joi.array().items(
        Joi.string().valid(
            'CHILDREN',
            'TEENAGERS',
            'YOUNG_ADULTS',
            'ADULTS',
            'SENIORS',
            'FAMILIES',
            'ALL_AGES'
        )
    ).required(),
    languages: Joi.array().items(Joi.string()).required(),
    schedule: Joi.object().required(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
    isOngoing: Joi.boolean().default(true),
    contactName: Joi.string().allow('').optional().max(100),
    contactPhone: Joi.string().allow('').optional().max(20),
    contactEmail: Joi.string().email().allow('').optional(),
    requiresRegistration: Joi.boolean().default(false),
    registrationDeadline: Joi.date().iso().optional(),
    maxParticipants: Joi.number().integer().min(1).optional(),
    currentParticipants: Joi.number().integer().min(0).optional(),
    isAccessible: Joi.boolean().default(true),
    requirements: Joi.array().items(Joi.string()).default([]),
    materials: Joi.array().items(Joi.string()).default([]),
    cost: Joi.string().allow('').optional().max(100),
    isActive: Joi.boolean().default(true),
    isPublic: Joi.boolean().default(true),
    parishId: Joi.string().required()
});

export const validateMinistry = (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = ministrySchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            error: 'Validation error',
            details: error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }))
        });
    }

    req.body = value;
    next();
};

export const createCheckDuplicateMinistry = (prismaClient: PrismaClient) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, parishId } = req.body;
            const { id } = req.params; // For updates, we need to exclude the current ministry

            const trimmedName = name.trim();

            const existingMinistry = await prismaClient.ministry.findFirst({
                where: {
                    name: {
                        equals: trimmedName,
                        mode: 'insensitive' // Case insensitive comparison
                    },
                    parishId,
                    // For updates, exclude the current ministry from the duplicate check
                    ...(id ? { NOT: { id } } : {})
                }
            });

            if (existingMinistry) {
                return res.status(409).json({
                    error: 'Duplicate ministry',
                    message: `A ministry with the name "${trimmedName}" already exists in this parish`
                });
            }

            next();
        } catch (error) {
            console.error('Error checking duplicate ministry:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
};