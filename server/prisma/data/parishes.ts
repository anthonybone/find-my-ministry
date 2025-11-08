export interface ParishData {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    latitude: number;
    longitude: number;
    phone?: string;
    email?: string;
    website?: string;
    pastor?: string;
    massSchedule?: any;
}

export const parishes: ParishData[] = [
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
    },
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
