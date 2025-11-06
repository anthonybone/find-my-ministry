import { PrismaClient, MinistryType, AgeGroup } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed process...');

    // Create LA Diocese
    const laDiocese = await prisma.diocese.upsert({
        where: { name: 'Archdiocese of Los Angeles' },
        update: {},
        create: {
            name: 'Archdiocese of Los Angeles',
            location: 'Los Angeles, California',
            website: 'https://lacatholics.org',
            phone: '(213) 637-7000',
            email: 'info@lacatholics.org',
        },
    });

    console.log('✅ Created/found LA Diocese');

    // Sample parishes in LA area
    const parishes = [
        {
            name: 'Cathedral of Our Lady of the Angels',
            address: '555 W Temple St',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90012',
            latitude: 34.0578207,
            longitude: -118.2480815,
            phone: '(213) 680-5200',
            website: 'https://olacathedral.org',
            pastor: 'Rev. Msgr. Kevin Kostelnik',
            massSchedule: {
                weekday: ['6:30 AM', '12:10 PM'],
                saturday: ['7:00 AM', '5:30 PM (Vigil)'],
                sunday: ['7:00 AM', '9:00 AM', '11:00 AM', '1:00 PM (Spanish)', '5:30 PM']
            }
        },
        {
            name: 'St. Monica Catholic Church',
            address: '725 California Ave',
            city: 'Santa Monica',
            state: 'CA',
            zipCode: '90403',
            latitude: 34.0248264,
            longitude: -118.4925834,
            phone: '(310) 393-9285',
            website: 'https://stmonica.net',
            pastor: 'Rev. Fabian Villalobos',
            massSchedule: {
                weekday: ['6:30 AM', '8:00 AM', '12:10 PM'],
                saturday: ['8:00 AM', '5:30 PM (Vigil)'],
                sunday: ['7:30 AM', '9:00 AM', '10:30 AM', '12:15 PM', '5:30 PM']
            }
        },
        {
            name: 'St. Basil Catholic Church',
            address: '3611 Wilshire Blvd',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90010',
            latitude: 34.0616337,
            longitude: -118.3088108,
            phone: '(213) 381-6191',
            website: 'https://stbasilkoreatown.org',
            pastor: 'Rev. Alejandro Cano',
            massSchedule: {
                weekday: ['7:00 AM', '12:15 PM', '6:00 PM'],
                saturday: ['8:00 AM', '6:00 PM (Vigil)'],
                sunday: ['7:00 AM', '9:00 AM', '11:00 AM', '1:00 PM (Korean)', '6:00 PM']
            }
        },
        {
            name: 'Holy Family Catholic Church',
            address: '1501 Fremont Ave',
            city: 'South Pasadena',
            state: 'CA',
            zipCode: '91030',
            latitude: 34.1063741,
            longitude: -118.1467785,
            phone: '(626) 799-8908',
            website: 'https://holyfamilysp.org',
            pastor: 'Rev. Philip Sandstrom',
            massSchedule: {
                weekday: ['8:00 AM'],
                saturday: ['8:00 AM', '5:00 PM (Vigil)'],
                sunday: ['7:30 AM', '9:00 AM', '10:30 AM', '12:00 PM']
            }
        }
    ];

    const createdParishes = await Promise.all(
        parishes.map(async (parish) => {
            return await prisma.parish.upsert({
                where: {
                    name: parish.name
                },
                update: {},
                create: {
                    ...parish,
                    dioceseId: laDiocese.id,
                },
            });
        })
    );

    console.log('✅ Created/found parishes');

    // Sample ministries for each parish
    const ministryTemplates = [
        {
            name: 'Youth Ministry',
            type: MinistryType.YOUTH_MINISTRY,
            description: 'Faith formation and community building for teenagers in grades 9-12. Activities include retreats, service projects, and social events.',
            ageGroups: [AgeGroup.TEENAGERS],
            languages: ['en'],
            schedule: {
                weekly: {
                    day: 'Wednesday',
                    time: '7:00 PM - 8:30 PM'
                }
            },
            contactName: 'Sarah Johnson',
            contactPhone: '(310) 555-0123',
            contactEmail: 'youth@parish.org',
            requiresRegistration: true,
            isAccessible: true,
            requirements: ['Parent permission slip required'],
            materials: ['Bible', 'Notebook'],
            cost: 'Free'
        },
        {
            name: 'Bible Study Group',
            type: MinistryType.BIBLE_STUDY,
            description: 'Weekly Bible study focusing on Sunday readings and Catholic teachings. Open to all adults seeking to deepen their faith.',
            ageGroups: [AgeGroup.ADULTS, AgeGroup.SENIORS],
            languages: ['en'],
            schedule: {
                weekly: {
                    day: 'Thursday',
                    time: '10:00 AM - 11:30 AM'
                }
            },
            contactName: 'Michael Rodriguez',
            contactEmail: 'biblestudy@parish.org',
            requiresRegistration: false,
            isAccessible: true,
            requirements: [],
            materials: ['Bible', 'Study guide provided'],
            cost: '$10 for study materials'
        },
        {
            name: 'Food Pantry',
            type: MinistryType.FOOD_PANTRY,
            description: 'Providing food assistance to families in need. Volunteers help with sorting, packing, and distribution.',
            ageGroups: [AgeGroup.ALL_AGES],
            languages: ['en', 'es'],
            schedule: {
                weekly: {
                    day: 'Saturday',
                    time: '9:00 AM - 12:00 PM'
                }
            },
            contactName: 'Maria Santos',
            contactPhone: '(213) 555-0456',
            contactEmail: 'foodpantry@parish.org',
            requiresRegistration: false,
            isAccessible: true,
            requirements: ['Background check for regular volunteers'],
            materials: [],
            cost: 'Free'
        },
        {
            name: 'Senior Ministry',
            type: MinistryType.SENIORS_MINISTRY,
            description: 'Monthly gatherings for seniors including lunch, fellowship, guest speakers, and occasional day trips.',
            ageGroups: [AgeGroup.SENIORS],
            languages: ['en'],
            schedule: {
                monthly: {
                    day: 'First Friday',
                    time: '11:30 AM - 2:00 PM'
                }
            },
            contactName: 'Dorothy Chen',
            contactPhone: '(626) 555-0789',
            contactEmail: 'seniors@parish.org',
            requiresRegistration: true,
            maxParticipants: 50,
            isAccessible: true,
            requirements: ['Age 60+'],
            materials: [],
            cost: '$5 for lunch'
        },
        {
            name: 'RCIA (Rite of Christian Initiation of Adults)',
            type: MinistryType.RCIA,
            description: 'Preparation program for adults seeking to join the Catholic Church or complete their initiation sacraments.',
            ageGroups: [AgeGroup.ADULTS],
            languages: ['en', 'es'],
            schedule: {
                weekly: {
                    day: 'Tuesday',
                    time: '7:30 PM - 9:00 PM'
                },
                season: 'September through Easter Vigil'
            },
            contactName: 'Father Martinez',
            contactPhone: '(213) 555-0321',
            contactEmail: 'rcia@parish.org',
            requiresRegistration: true,
            isAccessible: true,
            requirements: ['Interview with parish staff'],
            materials: ['Catholic Catechism', 'Bible'],
            cost: '$50 for materials'
        },
        {
            name: 'Knights of Columbus',
            type: MinistryType.KNIGHTS_OF_COLUMBUS,
            description: 'Catholic fraternal organization dedicated to charity, unity, fraternity, and patriotism. Monthly meetings and service projects.',
            ageGroups: [AgeGroup.ADULTS],
            languages: ['en'],
            schedule: {
                monthly: {
                    day: 'Second Tuesday',
                    time: '7:30 PM - 9:00 PM'
                }
            },
            contactName: 'Robert Kim',
            contactPhone: '(310) 555-0654',
            contactEmail: 'knights@parish.org',
            requiresRegistration: true,
            isAccessible: true,
            requirements: ['Catholic men 18+'],
            materials: [],
            cost: 'Membership dues apply'
        }
    ];

    // Create ministries for each parish
    for (const parish of createdParishes) {
        for (const template of ministryTemplates) {
            await prisma.ministry.create({
                data: {
                    ...template,
                    parishId: parish.id,
                },
            });
        }
    }

    console.log('✅ Created ministries for all parishes');

    // Create admin user
    await prisma.user.upsert({
        where: { email: 'admin@findmyministry.org' },
        update: {},
        create: {
            email: 'admin@findmyministry.org',
            name: 'Admin User',
            role: 'ADMIN',
        },
    });

    console.log('✅ Created admin user');
    console.log('🎉 Seed completed successfully!');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error('❌ Error during seed:', e);
        await prisma.$disconnect();
        process.exit(1);
    });