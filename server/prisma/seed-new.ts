import { PrismaClient } from '@prisma/client';
import { dioceses } from './data/dioceses';
import { parishes } from './data/parishes';
import { placeholderMinistries, realMinistries, type MinistryData } from './data/ministries';

const prisma = new PrismaClient();

// Environment flag to control whether to seed placeholder (fake) data
// Set SEED_INCLUDE_PLACEHOLDERS=false in production
const SEED_INCLUDE_PLACEHOLDERS = (process as any).env.SEED_INCLUDE_PLACEHOLDERS !== 'false';

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

    // Seed parishes
    console.log('\n⛪ Seeding parishes...');
    const seededParishes = [];
    const parishMap = new Map(); // name -> parish object

    for (const parishData of parishes) {
        // Find existing parish by name, city, and state
        const existingParish = await prisma.parish.findFirst({
            where: {
                name: parishData.name,
                city: parishData.city,
                state: parishData.state
            }
        });

        const parish = existingParish
            ? await prisma.parish.update({
                where: { id: existingParish.id },
                data: {
                    address: parishData.address,
                    zipCode: parishData.zipCode,
                    latitude: parishData.latitude,
                    longitude: parishData.longitude,
                    phone: parishData.phone,
                    email: parishData.email,
                    website: parishData.website,
                    pastor: parishData.pastor,
                    massSchedule: parishData.massSchedule,
                    dioceseId: laDiocese.id,
                }
            })
            : await prisma.parish.create({
                data: {
                    ...parishData,
                    dioceseId: laDiocese.id,
                }
            });
        seededParishes.push(parish);
        parishMap.set(parish.name, parish);
        console.log(`  ✅ ${parish.name} (${parish.city})`);
    }

    // Seed ministries
    console.log('\n🙏 Seeding ministries...');

    // Determine which ministries to seed
    const ministriesToSeed: MinistryData[] = [...realMinistries];
    if (SEED_INCLUDE_PLACEHOLDERS) {
        ministriesToSeed.push(...placeholderMinistries);
        console.log('  📝 Including placeholder ministries for testing');
    }

    let createdCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    for (const ministryData of ministriesToSeed) {
        const { parishName, ...ministryFields } = ministryData;

        // Determine which parishes to add this ministry to
        const targetParishes = parishName === 'ALL' ? seededParishes : [parishMap.get(parishName)].filter(Boolean);

        if (targetParishes.length === 0) {
            console.log(`  ⚠️  Skipping ministry "${ministryData.name}" - parish "${parishName}" not found`);
            skippedCount++;
            continue;
        }

        for (const parish of targetParishes) {
            try {
                // Find existing ministry by unique constraint
                const existingMinistry = await prisma.ministry.findFirst({
                    where: {
                        name: ministryFields.name,
                        parishId: parish!.id
                    }
                });

                const ministry = existingMinistry
                    ? await prisma.ministry.update({
                        where: { id: existingMinistry.id },
                        data: {
                            type: ministryFields.type,
                            description: ministryFields.description,
                            ageGroups: ministryFields.ageGroups,
                            languages: ministryFields.languages,
                            schedule: ministryFields.schedule,
                            contactName: ministryFields.contactName,
                            contactPhone: ministryFields.contactPhone,
                            contactEmail: ministryFields.contactEmail,
                            requiresRegistration: ministryFields.requiresRegistration,
                            maxParticipants: ministryFields.maxParticipants,
                            isAccessible: ministryFields.isAccessible,
                            requirements: ministryFields.requirements,
                            materials: ministryFields.materials,
                            cost: ministryFields.cost,
                        }
                    })
                    : await prisma.ministry.create({
                        data: {
                            ...ministryFields,
                            parishId: parish!.id,
                        }
                    });

                if (ministry.updatedAt.getTime() === ministry.createdAt.getTime()) {
                    createdCount++;
                } else {
                    updatedCount++;
                }
            } catch (error) {
                console.error(`  ❌ Error seeding ministry "${ministryFields.name}" for parish "${parish!.name}":`, error);
                skippedCount++;
            }
        }
    }

    console.log(`\n  ✅ Created ${createdCount} new ministries`);
    console.log(`  🔄 Updated ${updatedCount} existing ministries`);
    if (skippedCount > 0) {
        console.log(`  ⚠️  Skipped ${skippedCount} ministries`);
    }

    // Seed admin user
    console.log('\n👤 Seeding admin user...');
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@findmyministry.org' },
        update: {
            name: 'Admin User',
            role: 'ADMIN',
        },
        create: {
            email: 'admin@findmyministry.org',
            name: 'Admin User',
            role: 'ADMIN',
        },
    });
    console.log(`  ✅ ${adminUser.email}`);

    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • ${seededDioceses.length} diocese(s)`);
    console.log(`   • ${seededParishes.length} parish(es)`);
    console.log(`   • ${createdCount + updatedCount} ministry(ies) (${createdCount} new, ${updatedCount} updated)`);
    console.log(`   • 1 admin user`);

    if (SEED_INCLUDE_PLACEHOLDERS) {
        console.log('\n⚠️  Note: Placeholder ministries with [PLACEHOLDER] prefix are FAKE DATA for testing only.');
        console.log('   Set SEED_INCLUDE_PLACEHOLDERS=false to exclude them in production.');
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error('❌ Error during seed:', e);
        await prisma.$disconnect();
        (process as any).exit(1);
    });
