import { MinistryType, AgeGroup } from '@prisma/client';

export interface MinistryData {
    name: string;
    type: MinistryType;
    description: string;
    ageGroups: AgeGroup[];
    languages: string[];
    schedule: any;
    contactName?: string;
    contactPhone?: string;
    contactEmail?: string;
    requiresRegistration: boolean;
    maxParticipants?: number;
    isAccessible: boolean;
    requirements: string[];
    materials: string[];
    cost: string;
    parishName: string; // Used to link ministry to parish
}

// PLACEHOLDER ministries for testing (FAKE DATA - DO NOT USE IN PRODUCTION)
export const placeholderMinistries: MinistryData[] = [
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
        cost: 'Free',
        parishName: 'ALL' // Will be added to all parishes
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
        cost: '$10 for study materials',
        parishName: 'ALL'
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
        cost: 'Free',
        parishName: 'ALL'
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
        cost: '$5 for lunch',
        parishName: 'ALL'
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
        cost: '$50 for materials',
        parishName: 'ALL'
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
        cost: 'Membership dues apply',
        parishName: 'ALL'
    }
];

// REAL ministry data from actual LA parishes (verified sources)
export const realMinistries: MinistryData[] = [
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
        parishName: 'Cathedral of Our Lady of the Angels'
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
        parishName: 'Cathedral of Our Lady of the Angels'
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
        parishName: 'Cathedral of Our Lady of the Angels'
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
        parishName: 'Cathedral of Our Lady of the Angels'
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
        parishName: 'St. Monica Catholic Church'
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
        parishName: 'St. Monica Catholic Church'
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
        parishName: 'St. Monica Catholic Church'
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
        parishName: 'St. Monica Catholic Church'
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
        parishName: 'St. Monica Catholic Church'
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
        parishName: 'St. Monica Catholic Church'
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
        parishName: 'St. Monica Catholic Church'
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
        parishName: 'St. Monica Catholic Church'
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
        parishName: 'Our Lady of Loretto'
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
        parishName: 'Our Lady of Loretto'
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
        parishName: 'Our Lady of Loretto'
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
        parishName: 'Our Lady of Loretto'
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
        parishName: 'Our Lady of Loretto'
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
        parishName: 'Our Lady of Loretto'
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
        parishName: 'Our Lady of Loretto'
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
        parishName: 'Our Lady of Loretto'
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
        parishName: 'Our Lady of Loretto'
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
        parishName: 'Our Lady of Loretto'
    }
];
