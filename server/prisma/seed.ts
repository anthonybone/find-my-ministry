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
            // Check if parish exists first
            const existingParish = await prisma.parish.findFirst({
                where: { name: parish.name }
            });

            if (existingParish) {
                return existingParish;
            }

            return await prisma.parish.create({
                data: {
                    ...parish,
                    dioceseId: laDiocese.id,
                },
            });
        })
    );

    console.log('✅ Created/found parishes');

    // PLACEHOLDER ministries for testing (FAKE DATA - DO NOT USE)
    const ministryPlaceholders = [
        {
            name: '[PLACEHOLDER] Youth Ministry',
            type: MinistryType.YOUTH_MINISTRY,
            description: '[FAKE DATA] Generic youth ministry description for testing purposes only.',
            ageGroups: [AgeGroup.TEENAGERS],
            languages: ['en'],
            schedule: {
                weekly: {
                    day: 'Wednesday',
                    time: '7:00 PM - 8:30 PM'
                }
            },
            contactName: 'FAKE - Sarah Test',
            contactPhone: '(555) FAKE-123',
            contactEmail: 'PLACEHOLDER@example.com',
            requiresRegistration: true,
            isAccessible: true,
            requirements: ['[PLACEHOLDER] Parent permission slip required'],
            materials: ['Bible', 'Notebook'],
            cost: 'Free'
        },
        {
            name: '[PLACEHOLDER] Bible Study Group',
            type: MinistryType.BIBLE_STUDY,
            description: '[FAKE DATA] Generic bible study description for testing purposes only.',
            ageGroups: [AgeGroup.ADULTS, AgeGroup.SENIORS],
            languages: ['en'],
            schedule: {
                weekly: {
                    day: 'Thursday',
                    time: '10:00 AM - 11:30 AM'
                }
            },
            contactName: 'FAKE - Michael Test',
            contactEmail: 'PLACEHOLDER@example.com',
            requiresRegistration: false,
            isAccessible: true,
            requirements: [],
            materials: ['Bible', 'Study guide provided'],
            cost: '$10 for study materials'
        },
        {
            name: '[PLACEHOLDER] Food Pantry',
            type: MinistryType.FOOD_PANTRY,
            description: '[FAKE DATA] Generic food pantry description for testing purposes only.',
            ageGroups: [AgeGroup.ALL_AGES],
            languages: ['en', 'es'],
            schedule: {
                weekly: {
                    day: 'Saturday',
                    time: '9:00 AM - 12:00 PM'
                }
            },
            contactName: 'FAKE - Maria Test',
            contactPhone: '(555) FAKE-456',
            contactEmail: 'PLACEHOLDER@example.com',
            requiresRegistration: false,
            isAccessible: true,
            requirements: ['[PLACEHOLDER] Background check for regular volunteers'],
            materials: [],
            cost: 'Free'
        },
        {
            name: '[PLACEHOLDER] Senior Ministry',
            type: MinistryType.SENIORS_MINISTRY,
            description: '[FAKE DATA] Generic senior ministry description for testing purposes only.',
            ageGroups: [AgeGroup.SENIORS],
            languages: ['en'],
            schedule: {
                monthly: {
                    day: 'First Friday',
                    time: '11:30 AM - 2:00 PM'
                }
            },
            contactName: 'FAKE - Dorothy Test',
            contactPhone: '(555) FAKE-789',
            contactEmail: 'PLACEHOLDER@example.com',
            requiresRegistration: true,
            maxParticipants: 50,
            isAccessible: true,
            requirements: ['[PLACEHOLDER] Age 60+'],
            materials: [],
            cost: '$5 for lunch'
        },
        {
            name: '[PLACEHOLDER] RCIA',
            type: MinistryType.RCIA,
            description: '[FAKE DATA] Generic RCIA description for testing purposes only.',
            ageGroups: [AgeGroup.ADULTS],
            languages: ['en', 'es'],
            schedule: {
                weekly: {
                    day: 'Tuesday',
                    time: '7:30 PM - 9:00 PM'
                },
                season: 'September through Easter Vigil'
            },
            contactName: 'FAKE - Father Test',
            contactPhone: '(555) FAKE-321',
            contactEmail: 'PLACEHOLDER@example.com',
            requiresRegistration: true,
            isAccessible: true,
            requirements: ['[PLACEHOLDER] Interview with parish staff'],
            materials: ['Catholic Catechism', 'Bible'],
            cost: '$50 for materials'
        },
        {
            name: '[PLACEHOLDER] Knights of Columbus',
            type: MinistryType.KNIGHTS_OF_COLUMBUS,
            description: '[FAKE DATA] Generic Knights of Columbus description for testing purposes only.',
            ageGroups: [AgeGroup.ADULTS],
            languages: ['en'],
            schedule: {
                monthly: {
                    day: 'Second Tuesday',
                    time: '7:30 PM - 9:00 PM'
                }
            },
            contactName: 'FAKE - Robert Test',
            contactPhone: '(555) FAKE-654',
            contactEmail: 'PLACEHOLDER@example.com',
            requiresRegistration: true,
            isAccessible: true,
            requirements: ['[PLACEHOLDER] Catholic men 18+'],
            materials: [],
            cost: 'Membership dues apply'
        }
    ];

    // REAL ministry data from actual LA parishes (verified sources)
    const realMinistries = [
        // Cathedral of Our Lady of the Angels - REAL DATA
        {
            name: 'Cathedral Music Ministry - Spanish Chorus',
            type: MinistryType.CHOIR_MUSIC,
            description: 'The Spanish Chorus at the Cathedral of Our Lady of the Angels, directed by Jose Delgadillo. Open to singers who want to serve at Spanish-language masses.',
            ageGroups: [AgeGroup.ADULTS, AgeGroup.YOUNG_ADULTS],
            languages: ['es'],
            schedule: {
                weekly: {
                    day: 'Rehearsals by arrangement',
                    time: 'Times vary'
                }
            },
            contactName: 'Jose Delgadillo',
            contactEmail: 'coro@olacathedral.org',
            requiresRegistration: true,
            isAccessible: true,
            requirements: ['Must be able to commit to regular rehearsals', 'Basic Spanish singing ability'],
            materials: ['Music provided'],
            cost: 'Free',
            verified: true,
            source: 'olacathedral.org/music'
        },
        {
            name: 'Cathedral Volunteer Program - Hospitality Ministry',
            type: MinistryType.HOSPITALITY,
            description: 'The Cathedral of Our Lady of the Angels welcomes volunteers for hospitality ministry. Designated ministers welcome strangers and awaken the oneness in Christ within the community.',
            ageGroups: [AgeGroup.ALL_AGES],
            languages: ['en', 'es'],
            schedule: {
                flexible: 'Various opportunities available for weekend masses'
            },
            contactName: 'Cari Hilger',
            contactPhone: '(213) 680-5215',
            contactEmail: 'volunteers@olacathedral.org',
            requiresRegistration: true,
            isAccessible: true,
            requirements: ['General orientation required', 'Age-appropriate standards apply'],
            materials: ['Training provided'],
            cost: 'Free',
            verified: true,
            source: 'olacathedral.org/volunteer'
        },
        {
            name: 'Cathedral Altar Server Ministry',
            type: MinistryType.LITURGICAL_MINISTRY,
            description: 'Altar server ministry at the Cathedral of Our Lady of the Angels. Servers assist the priest during Mass and other liturgical celebrations.',
            ageGroups: [AgeGroup.CHILDREN, AgeGroup.TEENAGERS, AgeGroup.ADULTS],
            languages: ['en', 'es'],
            schedule: {
                flexible: 'Various mass times available'
            },
            contactName: 'Cari Hilger',
            contactPhone: '(213) 680-5215',
            contactEmail: 'volunteers@olacathedral.org',
            requiresRegistration: true,
            isAccessible: true,
            requirements: ['Training required', 'Regular commitment expected'],
            materials: ['Alb and other vestments provided'],
            cost: 'Free',
            verified: true,
            source: 'olacathedral.org/volunteer'
        },
        {
            name: 'Cathedral Lector Ministry',
            type: MinistryType.LITURGICAL_MINISTRY,
            description: 'Lector ministry at the Cathedral of Our Lady of the Angels. Lectors proclaim the Word of God during liturgical celebrations.',
            ageGroups: [AgeGroup.ADULTS],
            languages: ['en', 'es'],
            schedule: {
                flexible: 'Various mass times available'
            },
            contactName: 'Cari Hilger',
            contactPhone: '(213) 680-5215',
            contactEmail: 'volunteers@olacathedral.org',
            requiresRegistration: true,
            isAccessible: true,
            requirements: ['Training required', 'Good public speaking ability'],
            materials: ['Lectionary provided'],
            cost: 'Free',
            verified: true,
            source: 'olacathedral.org/volunteer'
        },
        // St. Monica Catholic Community - REAL DATA
        {
            name: 'St. Monica Youth Ministry',
            type: MinistryType.YOUTH_MINISTRY,
            description: 'Youth ministry program at St. Monica Catholic Community in Santa Monica, providing faith formation and community for teenagers.',
            ageGroups: [AgeGroup.TEENAGERS],
            languages: ['en'],
            schedule: {
                weekly: {
                    day: 'Contact for current schedule',
                    time: 'Evenings'
                }
            },
            contactPhone: '(310) 566-1500',
            requiresRegistration: true,
            isAccessible: true,
            requirements: ['Parent/guardian permission for minors'],
            materials: ['Materials provided'],
            cost: 'Contact for details',
            verified: true,
            source: 'stmonica.net/ministries/faithformation/youthmin'
        },
        {
            name: 'St. Monica JustFaith Ministry',
            type: MinistryType.SOCIAL_JUSTICE,
            description: 'JustFaith ministry at St. Monica Catholic Community, focusing on social justice education and action rooted in Catholic social teaching.',
            ageGroups: [AgeGroup.ADULTS, AgeGroup.YOUNG_ADULTS],
            languages: ['en'],
            schedule: {
                program: 'Contact for current program schedule'
            },
            contactPhone: '(310) 566-1500',
            requiresRegistration: true,
            isAccessible: true,
            requirements: ['Commitment to full program participation'],
            materials: ['Study materials provided'],
            cost: 'Contact for program fees',
            verified: true,
            source: 'stmonica.net/ministries/faithformation/just-faith'
        },
        {
            name: 'St. Monica GLO: LGBTQ+ Outreach Ministry',
            type: MinistryType.MISSION_OUTREACH,
            description: 'GLO (LGBTQ+ Outreach Ministry) at St. Monica Catholic Community provides a welcoming space for LGBTQ+ individuals and their families within the Catholic faith community.',
            ageGroups: [AgeGroup.ALL_AGES],
            languages: ['en'],
            schedule: {
                monthly: 'Regular gatherings - contact for schedule'
            },
            contactPhone: '(310) 566-1500',
            requiresRegistration: false,
            isAccessible: true,
            requirements: [],
            materials: [],
            cost: 'Free',
            verified: true,
            source: 'stmonica.net/ministries/fellowship-groups/glo'
        },
        {
            name: 'St. Monica Hope at the Door',
            type: MinistryType.MISSION_OUTREACH,
            description: 'Hope at the Door ministry at St. Monica Catholic Community provides direct outreach and assistance to homeless individuals and families in the Santa Monica area.',
            ageGroups: [AgeGroup.ADULTS, AgeGroup.YOUNG_ADULTS],
            languages: ['en', 'es'],
            schedule: {
                weekly: 'Regular outreach schedule - contact for details'
            },
            contactPhone: '(310) 566-1500',
            requiresRegistration: true,
            isAccessible: true,
            requirements: ['Background check may be required', 'Training session attendance'],
            materials: ['Supplies provided'],
            cost: 'Free to volunteer',
            verified: true,
            source: 'stmonica.net/ministries/pastoral-care/hope-at-the-door'
        },
        {
            name: 'St. Monica Stephen Ministry',
            type: MinistryType.PASTORAL_CARE,
            description: 'Stephen Ministry at St. Monica Catholic Community provides one-on-one Christian care and support to individuals going through difficult times in their lives.',
            ageGroups: [AgeGroup.ADULTS],
            languages: ['en'],
            schedule: {
                training: 'Initial training required, then flexible scheduling'
            },
            contactPhone: '(310) 566-1500',
            requiresRegistration: true,
            isAccessible: true,
            requirements: ['Training program completion', 'Commitment to confidentiality', 'Regular supervision meetings'],
            materials: ['Training materials provided'],
            cost: 'Free',
            verified: true,
            source: 'stmonica.net/ministries/pastoral-care/stephen-ministry-peer-support'
        },
        {
            name: 'St. Monica Green Team',
            type: MinistryType.COMMUNITY_SERVICE,
            description: 'Environmental ministry at St. Monica Catholic Community focused on caring for creation through beach cleanups, sustainability education, and environmental stewardship projects.',
            ageGroups: [AgeGroup.ALL_AGES],
            languages: ['en'],
            schedule: {
                monthly: 'Regular beach cleanups and environmental projects'
            },
            contactPhone: '(310) 566-1500',
            requiresRegistration: false,
            isAccessible: true,
            requirements: [],
            materials: ['Cleanup supplies provided'],
            cost: 'Free',
            verified: true,
            source: 'stmonica.net/serve/locally/greenteam'
        },
        {
            name: 'St. Monica Cornerstone Retreats',
            type: MinistryType.RETREAT_MINISTRY,
            description: 'Cornerstone retreats at St. Monica Catholic Community offer spiritual renewal and community building experiences for adults.',
            ageGroups: [AgeGroup.ADULTS],
            languages: ['en'],
            schedule: {
                periodic: 'Several times per year - check parish calendar'
            },
            contactPhone: '(310) 566-1500',
            requiresRegistration: true,
            isAccessible: true,
            requirements: ['Registration deadline applies'],
            materials: ['All materials provided'],
            cost: 'Contact for retreat fees',
            verified: true,
            source: 'stmonica.net/ministries/faithformation/cornerstone-retreats'
        },
        {
            name: 'St. Monica Scripture Encounter',
            type: MinistryType.BIBLE_STUDY,
            description: 'Scripture Encounter at St. Monica Catholic Community provides in-depth study of the Bible in a supportive group setting.',
            ageGroups: [AgeGroup.ADULTS],
            languages: ['en'],
            schedule: {
                weekly: 'Contact for current schedule and format'
            },
            contactPhone: '(310) 566-1500',
            requiresRegistration: true,
            isAccessible: true,
            requirements: [],
            materials: ['Study guides provided'],
            cost: 'Contact for material fees',
            verified: true,
            source: 'stmonica.net/ministries/faithformation/2020sscruptureencounter'
        }
    ];

    // Create PLACEHOLDER ministries for each parish (FAKE DATA)
    for (const parish of createdParishes) {
        for (const template of ministryPlaceholders) {
            await prisma.ministry.create({
                data: {
                    ...template,
                    parishId: parish.id,
                },
            });
        }
    }

    console.log('✅ Created placeholder ministries for all parishes');

    // Create REAL ministries for specific parishes
    // Cathedral ministries (Cathedral of Our Lady of the Angels)
    const cathedral = createdParishes.find((p: any) => p.name === 'Cathedral of Our Lady of the Angels');
    if (cathedral) {
        const cathedralMinistries = realMinistries.filter(m =>
            m.name.includes('Cathedral') || m.contactEmail === 'coro@olacathedral.org' || m.contactEmail === 'volunteers@olacathedral.org'
        );

        for (const ministry of cathedralMinistries) {
            const { verified, source, ...ministryData } = ministry;

            await prisma.ministry.create({
                data: {
                    ...ministryData,
                    parishId: cathedral.id,
                },
            });
        }
        console.log(`✅ Created ${cathedralMinistries.length} real ministries for Cathedral of Our Lady of the Angels`);
    }

    // St. Monica ministries
    const stMonica = createdParishes.find((p: any) => p.name === 'St. Monica Catholic Church');
    if (stMonica) {
        const stMonicaMinistries = realMinistries.filter(m =>
            m.name.includes('St. Monica') || m.contactPhone === '(310) 566-1500'
        );

        for (const ministry of stMonicaMinistries) {
            const { verified, source, ...ministryData } = ministry;
            await prisma.ministry.create({
                data: {
                    ...ministryData,
                    parishId: stMonica.id,
                },
            });
        }
        console.log(`✅ Created ${stMonicaMinistries.length} real ministries for St. Monica Catholic Church`);
    }

    console.log('✅ Created all real ministries from verified sources');
    console.log('📋 Real ministry data sources:');
    console.log('   - Cathedral of Our Lady of the Angels: olacathedral.org');
    console.log('   - St. Monica Catholic Community: stmonica.net');
    console.log('');
    console.log('🔍 For verification purposes, real ministries include:');
    realMinistries.forEach(ministry => {
        console.log(`   - ${ministry.name} (Source: ${ministry.source})`);
    });

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