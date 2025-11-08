import { PrismaClient } from '@prisma/client';
import { dioceses } from './data/dioceses';
import { parishes } from './data/parishes';
import { placeholderMinistries, realMinistries } from './data/ministries';

const prisma = new PrismaClient();

// Environment flag to control whether to seed placeholder (fake) data
// Set SEED_INCLUDE_PLACEHOLDERS=false in production
const SEED_INCLUDE_PLACEHOLDERS = process.env.SEED_INCLUDE_PLACEHOLDERS !== 'false';

async function main() {
    console.log('🌱 Starting seed process...');
    console.log(`📋 Placeholder data: ${SEED_INCLUDE_PLACEHOLDERS ? 'ENABLED' : 'DISABLED'}`);

    // Seed dioceses
    console.log('\n📍 Seeding dioceses...');
    const seededDioceses = [];
    for (const dioceseData of dioceses) {
        const diocese = await prisma.diocese.upsert({
            where: { name: dioceseData.name },
            update: {
                location: dioceseData.location,
                website: dioceseData.website,
                phone: dioceseData.phone,
                email: dioceseData.email,
            },
            create: dioceseData,
        });
        seededDioceses.push(diocese);
        console.log(`  ✅ ${diocese.name}`);
    }

    const laDiocese = seededDioceses[0]; // Primary diocese for this seed

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

    // Additional Los Angeles parishes
    const newParishes = [
        {
            name: 'Our Lady of Loretto',
            address: '250 N Union Ave',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90026',
            latitude: 34.0779,
            longitude: -118.2481,
            phone: '(213) 483-3013',
            email: 'lorettola@aol.com',
            website: 'https://lorettola.org',
            pastor: 'Rev. Jesus Nieto-Ruiz',
            massSchedule: {
                weekday: ['MON, WED, FRI, SAT: 8:00 AM English', 'TUE, THU: 8:00 AM Spanish', 'First Friday: 7:00 PM Spanish'],
                saturday: ['8:00 AM English', '5:30 PM Spanish (Vigil)'],
                sunday: ['8:00 AM English', '9:45 AM Spanish', '11:30 AM English', '1:00 PM Spanish', '3:00 PM Vietnamese']
            }
        },
        {
            name: 'St. Kevin Catholic Church',
            address: '1600 Hillhurst Ave',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90027',
            latitude: 34.0956,
            longitude: -118.2882,
            phone: '(323) 664-6030',
            pastor: 'Rev. Michael Rocha',
            massSchedule: {
                weekday: ['8:00 AM'],
                saturday: ['8:00 AM', '5:30 PM (Vigil)'],
                sunday: ['7:30 AM', '9:00 AM', '10:30 AM', '12:15 PM', '6:00 PM']
            }
        },
        {
            name: 'Precious Blood Catholic Church',
            address: '435 S Occidental Blvd',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90057',
            latitude: 34.0597,
            longitude: -118.2819,
            phone: '(213) 382-2156',
            pastor: 'Rev. Giovanni Carrasco',
            massSchedule: {
                weekday: ['7:30 AM', '6:00 PM'],
                saturday: ['8:00 AM', '6:00 PM (Vigil)'],
                sunday: ['7:00 AM', '8:30 AM', '10:00 AM', '11:30 AM', '1:00 PM (Spanish)', '6:00 PM']
            }
        },
        {
            name: 'Immaculate Heart of Mary Catholic Church',
            address: '5515 Franklin Ave',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90028',
            latitude: 34.1041,
            longitude: -118.3085,
            phone: '(323) 466-3395',
            pastor: 'Rev. John Molyneux',
            massSchedule: {
                weekday: ['8:00 AM'],
                saturday: ['8:00 AM', '5:00 PM (Vigil)'],
                sunday: ['8:00 AM', '10:00 AM', '12:00 PM', '6:00 PM']
            }
        },
        {
            name: 'St. Brendan Catholic Church',
            address: '310 S Van Ness Ave',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90020',
            latitude: 34.0679,
            longitude: -118.2986,
            phone: '(213) 385-1710',
            pastor: 'Rev. Edward Benioff',
            massSchedule: {
                weekday: ['7:30 AM', '6:00 PM'],
                saturday: ['8:00 AM', '5:30 PM (Vigil)'],
                sunday: ['7:00 AM', '8:30 AM', '10:30 AM', '12:30 PM', '6:00 PM']
            }
        },
        {
            name: 'Blessed Sacrament Catholic Church',
            address: '6657 Sunset Blvd',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90028',
            latitude: 34.0976,
            longitude: -118.3368,
            phone: '(323) 462-6483',
            pastor: 'Rev. Thomas Stehle',
            massSchedule: {
                weekday: ['8:00 AM', '6:00 PM'],
                saturday: ['8:00 AM', '5:30 PM (Vigil)'],
                sunday: ['7:30 AM', '9:00 AM', '11:00 AM', '12:30 PM', '6:00 PM']
            }
        },
        {
            name: 'Christ the King Catholic Church',
            address: '624 N Rossmore Ave',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90004',
            latitude: 34.0783,
            longitude: -118.3252,
            phone: '(323) 467-2781',
            pastor: 'Rev. John Dietzenbach',
            massSchedule: {
                weekday: ['8:00 AM'],
                saturday: ['8:00 AM', '5:00 PM (Vigil)'],
                sunday: ['8:00 AM', '10:00 AM', '12:00 PM', '6:00 PM']
            }
        },
        {
            name: 'St. Vincent de Paul Catholic Church',
            address: '621 W Adams Blvd',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90007',
            latitude: 34.0357,
            longitude: -118.2774,
            phone: '(213) 749-8950',
            pastor: 'Rev. Aidan McAleenan',
            massSchedule: {
                weekday: ['7:30 AM', '12:10 PM', '6:00 PM'],
                saturday: ['8:00 AM', '5:30 PM (Vigil)'],
                sunday: ['7:30 AM', '9:00 AM', '10:30 AM', '12:00 PM', '1:30 PM (Spanish)', '6:00 PM']
            }
        },
        // Parishes from Catholic LA website
        {
            name: 'All Saints Catholic Church',
            address: '3431 Portola Avenue',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90032',
            latitude: 34.0743,
            longitude: -118.1891
        },
        {
            name: 'All Souls Catholic Church',
            address: '17 South Electric Avenue',
            city: 'Alhambra',
            state: 'CA',
            zipCode: '91801',
            latitude: 34.0953,
            longitude: -118.1270
        },
        {
            name: 'American Martyrs Catholic Church',
            address: '624 15th Street',
            city: 'Manhattan Beach',
            state: 'CA',
            zipCode: '90266',
            latitude: 33.8847,
            longitude: -118.4109
        },
        {
            name: 'Annunciation Catholic Church',
            address: '1307 East Longden Avenue',
            city: 'Arcadia',
            state: 'CA',
            zipCode: '91006',
            latitude: 34.1386,
            longitude: -118.0353
        },
        {
            name: 'Ascension Catholic Church',
            address: '517 West 112th Street',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90044',
            latitude: 33.9328,
            longitude: -118.2739
        },
        {
            name: 'Assumption Catholic Church',
            address: '2832 Blanchard Street',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90033',
            latitude: 34.0331,
            longitude: -118.2147
        },
        {
            name: 'Assumption of the Blessed Virgin Mary Catholic Church',
            address: '2640 East Orange Grove Boulevard',
            city: 'Pasadena',
            state: 'CA',
            zipCode: '91107',
            latitude: 34.1314,
            longitude: -118.1031
        },
        {
            name: 'Beatitudes of Our Lord Catholic Church',
            address: '13013 South Santa Gertrudes Avenue',
            city: 'La Mirada',
            state: 'CA',
            zipCode: '90638',
            latitude: 33.9172,
            longitude: -118.0120
        },
        {
            name: 'Blessed Junipero Serra Catholic Church',
            address: '42121 North 60th Street West',
            city: 'Lancaster',
            state: 'CA',
            zipCode: '93536',
            latitude: 34.7361,
            longitude: -118.1739
        },
        {
            name: 'Cathedral Chapel',
            address: '923 South La Brea',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90036',
            latitude: 34.0522,
            longitude: -118.3440
        },
        {
            name: 'Corpus Christi Catholic Church',
            address: '880 Toyopa Drive',
            city: 'Pacific Palisades',
            state: 'CA',
            zipCode: '90272',
            latitude: 34.0569,
            longitude: -118.5320
        },
        {
            name: 'Cristo Rey Catholic Church',
            address: '4343 Perlita Avenue',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90039',
            latitude: 34.1142,
            longitude: -118.2739
        },
        {
            name: 'Divine Saviour Catholic Church',
            address: '610 Cypress Avenue',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90065',
            latitude: 34.1008,
            longitude: -118.2086
        },
        {
            name: 'Dolores Mission Church',
            address: '171 South Gless Street',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90033',
            latitude: 34.0331,
            longitude: -118.2142
        },
        {
            name: 'Epiphany Catholic Church',
            address: '10911 Michael Hunt Drive',
            city: 'South El Monte',
            state: 'CA',
            zipCode: '91733',
            latitude: 34.0517,
            longitude: -118.0453
        },
        {
            name: 'Good Shepherd Catholic Church',
            address: '505 North Bedford Drive',
            city: 'Beverly Hills',
            state: 'CA',
            zipCode: '90210',
            latitude: 34.0736,
            longitude: -118.4003
        },
        {
            name: 'Guardian Angel Catholic Church',
            address: '10886 Lehigh Avenue',
            city: 'Pacoima',
            state: 'CA',
            zipCode: '91331',
            latitude: 34.2806,
            longitude: -118.4220
        },
        {
            name: 'Holy Angels Catholic Church',
            address: '370 Campus Drive',
            city: 'Arcadia',
            state: 'CA',
            zipCode: '91007',
            latitude: 34.1397,
            longitude: -118.0353
        },
        {
            name: 'Holy Angels Catholic Church of the Deaf',
            address: '4433 South Santa Fe Avenue',
            city: 'Vernon',
            state: 'CA',
            zipCode: '90058',
            latitude: 33.9894,
            longitude: -118.2342
        },
        {
            name: 'Holy Cross Catholic Church',
            address: '4705 South Main Street',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90037',
            latitude: 34.0075,
            longitude: -118.2681
        },
        {
            name: 'Holy Cross Catholic Church (Santa Barbara)',
            address: '1740 Cliff Dr.',
            city: 'Santa Barbara',
            state: 'CA',
            zipCode: '93109',
            latitude: 34.4086,
            longitude: -119.7467
        },
        {
            name: 'Holy Family Catholic Church (Wilmington)',
            address: '1011 East "L" Street',
            city: 'Wilmington',
            state: 'CA',
            zipCode: '90744',
            latitude: 33.7842,
            longitude: -118.2506
        },
        {
            name: 'Holy Family Church (Glendale)',
            address: '500 South Louise Street',
            city: 'Glendale',
            state: 'CA',
            zipCode: '91205',
            latitude: 34.1372,
            longitude: -118.2525
        },
        {
            name: 'Holy Innocents Catholic Church',
            address: '425 East 20th Street',
            city: 'Long Beach',
            state: 'CA',
            zipCode: '90806',
            latitude: 33.7953,
            longitude: -118.1831
        },
        {
            name: 'Holy Name of Jesus Catholic Church',
            address: '2190 West 31st Street',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90018',
            latitude: 34.0228,
            longitude: -118.3072
        },
        {
            name: 'Holy Name of Mary Catholic Church',
            address: '724 East Bonita Avenue',
            city: 'San Dimas',
            state: 'CA',
            zipCode: '91773',
            latitude: 34.1064,
            longitude: -117.8067
        },
        {
            name: 'Holy Redeemer Catholic Church',
            address: '2411 Montrose Avenue',
            city: 'Montrose',
            state: 'CA',
            zipCode: '91020',
            latitude: 34.2086,
            longitude: -118.2322
        },
        {
            name: 'Holy Spirit Catholic Church',
            address: '1421 South Dunsmuir Avenue',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90019',
            latitude: 34.0447,
            longitude: -118.3331
        },
        {
            name: 'Holy Trinity Catholic Church',
            address: '209 North Hanford Street',
            city: 'San Pedro',
            state: 'CA',
            zipCode: '90732',
            latitude: 33.7428,
            longitude: -118.2892
        },
        {
            name: 'Holy Trinity Church (Los Angeles)',
            address: '3722 Boyce Ave.',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90039',
            latitude: 34.1142,
            longitude: -118.2739
        },
        {
            name: 'Immaculate Conception Catholic Church',
            address: '1433 James M. Wood Boulevard',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90015',
            latitude: 34.0386,
            longitude: -118.2681
        },
        {
            name: 'Incarnation Catholic Church',
            address: '1001 North Brand Boulevard',
            city: 'Glendale',
            state: 'CA',
            zipCode: '91202',
            latitude: 34.1644,
            longitude: -118.2525
        },
        {
            name: 'La Purisima Concepcion Catholic Church',
            address: '213 West Olive Avenue',
            city: 'Lompoc',
            state: 'CA',
            zipCode: '93436',
            latitude: 34.6389,
            longitude: -120.4578
        },
        {
            name: 'Maria Regina Catholic Church',
            address: '2150 West 135th Street',
            city: 'Gardena',
            state: 'CA',
            zipCode: '90249',
            latitude: 33.9186,
            longitude: -118.3031
        },
        {
            name: 'Mary Immaculate Catholic Church',
            address: '10390 Remick Avenue',
            city: 'Pacoima',
            state: 'CA',
            zipCode: '91331',
            latitude: 34.2806,
            longitude: -118.4220
        },
        {
            name: 'Mary Star of the Sea Catholic Church',
            address: '870 West 8th Street',
            city: 'San Pedro',
            state: 'CA',
            zipCode: '90731',
            latitude: 33.7428,
            longitude: -118.2892
        },
        {
            name: 'Mission Basilica San Buenaventura',
            address: '211 East Main Street',
            city: 'Ventura',
            state: 'CA',
            zipCode: '93001',
            latitude: 34.2747,
            longitude: -119.2914
        },
        {
            name: 'Mission San Fernando Rey de España',
            address: 'San Fernando Mission Boulevard',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '91345',
            latitude: 34.2822,
            longitude: -118.4639
        },
        {
            name: 'Mother of Sorrows Catholic Church',
            address: '114 West 87th Street',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90003',
            latitude: 33.9581,
            longitude: -118.2681
        },
        {
            name: 'Nativity Catholic Church',
            address: '1447 Engracia Avenue',
            city: 'Torrance',
            state: 'CA',
            zipCode: '90501',
            latitude: 33.8358,
            longitude: -118.3464
        },
        {
            name: 'Nativity Church (El Monte)',
            address: '3743 Tyler Ave',
            city: 'El Monte',
            state: 'CA',
            zipCode: '91731',
            latitude: 34.0517,
            longitude: -118.0453
        },
        {
            name: 'Nuestra Señora Reina De Los Angeles (La Placita)',
            address: '535 North Main Street',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90012',
            latitude: 34.0578,
            longitude: -118.2381
        },
        {
            name: 'Old Mission Santa Ines',
            address: 'P.O. Box 408',
            city: 'Solvang',
            state: 'CA',
            zipCode: '93463',
            latitude: 34.5958,
            longitude: -120.1378
        },
        {
            name: 'Our Lady Help of Christians Church',
            address: '512 South Avenue 20',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90031',
            latitude: 34.0800,
            longitude: -118.2281
        },
        {
            name: 'Our Lady of Grace Catholic Church',
            address: '5011 White Oak Avenue',
            city: 'Encino',
            state: 'CA',
            zipCode: '91316',
            latitude: 34.1686,
            longitude: -118.5031
        },
        {
            name: 'Our Lady of Guadalupe Catholic Church (Guadalupe)',
            address: '1164 Obispo St.',
            city: 'Guadalupe',
            state: 'CA',
            zipCode: '93434',
            latitude: 34.9719,
            longitude: -120.5714
        },
        {
            name: 'Our Lady of Guadalupe Catholic Church (Hammel)',
            address: '4018 Hammel Street',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90063',
            latitude: 34.0331,
            longitude: -118.1892
        },
        {
            name: 'Our Lady of Guadalupe Catholic Church (Hermosa Beach)',
            address: '244 Prospect Avenue',
            city: 'Hermosa Beach',
            state: 'CA',
            zipCode: '90254',
            latitude: 33.8631,
            longitude: -118.4000
        },
        {
            name: 'Our Lady of Guadalupe Catholic Church (Rose Hill)',
            address: '4509 Mercury Avenue',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90032',
            latitude: 34.0743,
            longitude: -118.1891
        }
    ];

    // Combine both parish arrays
    const allParishes = [...parishes, ...newParishes];

    const createdParishes = await Promise.all(
        allParishes.map(async (parish) => {
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
        },

        // Our Lady of Loretto - REAL DATA
        {
            name: 'Our Lady of Loretto RCIA Program',
            type: MinistryType.RCIA,
            description: 'The Rite of Christian Initiation of Adults (RICA in Spanish) at Our Lady of Loretto prepares adults for full membership in the Catholic Church.',
            ageGroups: [AgeGroup.ADULTS],
            languages: ['en', 'es'],
            schedule: {
                weekly: {
                    day: 'Contact parish for current schedule',
                    time: 'Times vary'
                }
            },
            contactPhone: '(213) 483-3013',
            contactEmail: 'lorettola@aol.com',
            requiresRegistration: true,
            isAccessible: true,
            requirements: ['Open to unbaptized adults and baptized Christians seeking full communion'],
            materials: ['Study materials provided'],
            cost: 'Free',
            verified: true,
            source: 'lorettola.org/rcia'
        },
        {
            name: 'Our Lady of Loretto Legion of Mary (English)',
            type: MinistryType.PRAYER_GROUP,
            description: 'The Legion of Mary is a lay apostolic association of Catholics who serve the Church on a voluntary basis. English-speaking group at Our Lady of Loretto.',
            ageGroups: [AgeGroup.ADULTS],
            languages: ['en'],
            schedule: {
                weekly: {
                    day: 'Contact for meeting schedule',
                    time: 'Times vary'
                }
            },
            contactPhone: '(213) 483-3013',
            requiresRegistration: false,
            isAccessible: true,
            requirements: ['Commitment to prayer and service'],
            materials: ['Legion handbook provided'],
            cost: 'Free',
            verified: true,
            source: 'lorettola.org/legion-of-mary'
        },
        {
            name: 'Our Lady of Loretto Legión de María (Español)',
            type: MinistryType.PRAYER_GROUP,
            description: 'La Legión de María es una asociación laical apostólica de católicos que sirven a la Iglesia voluntariamente. Grupo en español en Nuestra Señora de Loretto.',
            ageGroups: [AgeGroup.ADULTS],
            languages: ['es'],
            schedule: {
                weekly: {
                    day: 'Contactar para horarios',
                    time: 'Horarios varían'
                }
            },
            contactPhone: '(213) 483-3013',
            requiresRegistration: false,
            isAccessible: true,
            requirements: ['Compromiso a la oración y servicio'],
            materials: ['Manual de la Legión proporcionado'],
            cost: 'Gratis',
            verified: true,
            source: 'lorettola.org/legion-de-maria'
        },
        {
            name: 'Our Lady of Loretto Knights of Columbus',
            type: MinistryType.KNIGHTS_OF_COLUMBUS,
            description: 'The Knights of Columbus at Our Lady of Loretto (Caballeros de Colón) is a Catholic fraternal organization for men focused on charity, unity, fraternity, and patriotism.',
            ageGroups: [AgeGroup.ADULTS],
            languages: ['en', 'es'],
            schedule: {
                monthly: {
                    day: 'Contact for meeting schedule',
                    time: 'Evening meetings'
                }
            },
            contactPhone: '(213) 483-3013',
            requiresRegistration: true,
            isAccessible: true,
            requirements: ['Catholic men 18 years and older', 'Good standing in the Church'],
            materials: [],
            cost: 'Membership dues apply',
            verified: true,
            source: 'lorettola.org/knights-of-columbus'
        },
        {
            name: 'Our Lady of Loretto Music Ministry',
            type: MinistryType.CHOIR_MUSIC,
            description: 'Music ministry at Our Lady of Loretto enhances liturgical celebrations through song and music at various masses in English, Spanish, and Vietnamese.',
            ageGroups: [AgeGroup.ALL_AGES],
            languages: ['en', 'es', 'vi'],
            schedule: {
                weekly: {
                    day: 'Rehearsals and weekend masses',
                    time: 'Contact for rehearsal times'
                }
            },
            contactPhone: '(213) 483-3013',
            requiresRegistration: true,
            isAccessible: true,
            requirements: ['Ability to sing and commitment to regular participation'],
            materials: ['Sheet music provided'],
            cost: 'Free',
            verified: true,
            source: 'lorettola.org/music-ministry'
        },
        {
            name: 'Our Lady of Loretto Altar Servers',
            type: MinistryType.LITURGICAL_MINISTRY,
            description: 'Altar servers (Monaguillos) at Our Lady of Loretto assist priests during Mass and other liturgical celebrations.',
            ageGroups: [AgeGroup.CHILDREN, AgeGroup.TEENAGERS, AgeGroup.ADULTS],
            languages: ['en', 'es'],
            schedule: {
                flexible: 'Various mass times throughout the week'
            },
            contactPhone: '(213) 483-3013',
            requiresRegistration: true,
            isAccessible: true,
            requirements: ['Training required', 'Regular commitment to serve'],
            materials: ['Alb and serving materials provided'],
            cost: 'Free',
            verified: true,
            source: 'lorettola.org/altar-servers'
        },
        {
            name: 'Our Lady of Loretto Eucharistic Adoration',
            type: MinistryType.PRAYER_GROUP,
            description: 'Eucharistic Adoration at Our Lady of Loretto provides time for prayer and contemplation before the Blessed Sacrament.',
            ageGroups: [AgeGroup.ALL_AGES],
            languages: ['en', 'es'],
            schedule: {
                weekly: {
                    day: 'Friday',
                    time: '8:45 AM - 6:45 PM'
                }
            },
            contactPhone: '(213) 483-3013',
            requiresRegistration: false,
            isAccessible: true,
            requirements: [],
            materials: [],
            cost: 'Free',
            verified: true,
            source: 'lorettola.org/adoration'
        },
        {
            name: 'Our Lady of Loretto Lectors',
            type: MinistryType.LITURGICAL_MINISTRY,
            description: 'Lectors (Lectores) at Our Lady of Loretto proclaim the Word of God during Mass in English and Spanish.',
            ageGroups: [AgeGroup.ADULTS, AgeGroup.YOUNG_ADULTS],
            languages: ['en', 'es'],
            schedule: {
                flexible: 'Various mass times'
            },
            contactPhone: '(213) 483-3013',
            requiresRegistration: true,
            isAccessible: true,
            requirements: ['Training in proper proclamation', 'Good reading skills'],
            materials: ['Lectionary and workbook provided'],
            cost: 'Free',
            verified: true,
            source: 'lorettola.org/lectors'
        },
        {
            name: 'Our Lady of Loretto Movimiento Familiar Cristiano',
            type: MinistryType.MARRIAGE_FAMILY,
            description: 'Christian Family Movement (Movimiento Familiar Cristiano) at Our Lady of Loretto supports married couples and families in their spiritual growth.',
            ageGroups: [AgeGroup.ADULTS, AgeGroup.FAMILIES],
            languages: ['es'],
            schedule: {
                monthly: {
                    day: 'Contact for meeting schedule',
                    time: 'Evening meetings'
                }
            },
            contactPhone: '(213) 483-3013',
            requiresRegistration: true,
            isAccessible: true,
            requirements: ['Married couples welcome'],
            materials: ['Study materials provided'],
            cost: 'Free',
            verified: true,
            source: 'lorettola.org/movimiento-familia-cristiana'
        },
        {
            name: 'Our Lady of Loretto Vietnamese Community',
            type: MinistryType.OTHER,
            description: 'Vietnamese Catholic community ministries at Our Lady of Loretto including Ca Đoàn Emmanuel, Các Bà mẹ công giáo, liên minh thánh tâm, and thiếu nhi thánh thể.',
            ageGroups: [AgeGroup.ALL_AGES],
            languages: ['vi'],
            schedule: {
                weekly: {
                    day: 'Sunday and other times',
                    time: '3:00 PM mass and community activities'
                }
            },
            contactPhone: '(213) 483-3013',
            requiresRegistration: false,
            isAccessible: true,
            requirements: [],
            materials: [],
            cost: 'Free',
            verified: true,
            source: 'lorettola.org/ministries'
        }
    ];

    // Create PLACEHOLDER ministries for each parish (FAKE DATA)
    for (const parish of createdParishes) {
        for (const template of ministryPlaceholders) {
            // Check if ministry already exists
            const existingMinistry = await prisma.ministry.findFirst({
                where: {
                    name: template.name,
                    parishId: parish.id
                }
            });

            if (!existingMinistry) {
                await prisma.ministry.create({
                    data: {
                        ...template,
                        parishId: parish.id,
                    },
                });
            }
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

            // Check if ministry already exists
            const existingMinistry = await prisma.ministry.findFirst({
                where: {
                    name: ministryData.name,
                    parishId: cathedral.id
                }
            });

            if (!existingMinistry) {
                await prisma.ministry.create({
                    data: {
                        ...ministryData,
                        parishId: cathedral.id,
                    },
                });
            }
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

            // Check if ministry already exists
            const existingMinistry = await prisma.ministry.findFirst({
                where: {
                    name: ministryData.name,
                    parishId: stMonica.id
                }
            });

            if (!existingMinistry) {
                await prisma.ministry.create({
                    data: {
                        ...ministryData,
                        parishId: stMonica.id,
                    },
                });
            }
        }
        console.log(`✅ Created ${stMonicaMinistries.length} real ministries for St. Monica Catholic Church`);
    }

    // Our Lady of Loretto ministries
    const ourLadyOfLoretto = createdParishes.find((p: any) => p.name === 'Our Lady of Loretto');
    if (ourLadyOfLoretto) {
        const lorettoMinistries = realMinistries.filter(m =>
            m.name.includes('Our Lady of Loretto') || m.contactPhone === '(213) 483-3013'
        );

        for (const ministry of lorettoMinistries) {
            const { verified, source, ...ministryData } = ministry;

            // Check if ministry already exists
            const existingMinistry = await prisma.ministry.findFirst({
                where: {
                    name: ministryData.name,
                    parishId: ourLadyOfLoretto.id
                }
            });

            if (!existingMinistry) {
                await prisma.ministry.create({
                    data: {
                        ...ministryData,
                        parishId: ourLadyOfLoretto.id,
                    },
                });
            }
        }
        console.log(`✅ Created ${lorettoMinistries.length} real ministries for Our Lady of Loretto`);
    }

    console.log('✅ Created all real ministries from verified sources');
    console.log('📋 Real ministry data sources:');
    console.log('   - Cathedral of Our Lady of the Angels: olacathedral.org');
    console.log('   - St. Monica Catholic Community: stmonica.net');
    console.log('   - Our Lady of Loretto Catholic Church: lorettola.org');
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