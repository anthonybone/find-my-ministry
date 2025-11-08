# Seed Data Refactoring

## Overview

The seed data has been refactored to improve maintainability, prevent data deletion, and separate concerns.

## New Structure

```
server/prisma/
├── data/
│   ├── dioceses.ts      # Diocese data
│   ├── parishes.ts      # Parish data
│   └── ministries.ts    # Ministry data (placeholder + real)
├── seed.ts              # NEW: Main seed script (to be created)
└── seed.ts.backup       # OLD: Original monolithic seed file
```

## Key Improvements

### 1. **No Data Deletion**
- All operations use `upsert` instead of `create`
- Running the seed multiple times is safe
- Existing data is updated, not deleted

### 2. **Separated Data Files**
- **dioceses.ts**: Diocese definitions
- **parishes.ts**: Parish information (67 parishes)
- **ministries.ts**: Both placeholder (fake) and real ministry data

### 3. **Environment Flag for Placeholders**
- Set `SEED_INCLUDE_PLACEHOLDERS=false` to exclude fake data
- By default, placeholders are included for testing
- All placeholder ministries have `[PLACEHOLDER]` prefix

### 4. **Better Error Handling**
- Detailed logging with emojis for easy reading
- Counts created vs. updated records
- Reports skipped ministries with reasons

## TODO: Create New seed.ts

The refactored seed.ts needs to be created with the following content:

```typescript
import { PrismaClient } from '@prisma/client';
import { dioceses } from './data/dioceses';
import { parishes } from './data/parishes';
import { placeholderMinistries, realMinistries, type MinistryData } from './data/ministries';

const prisma = new PrismaClient();

const SEED_INCLUDE_PLACEHOLDERS = process.env.SEED_INCLUDE_PLACEHOLDERS !== 'false';

async function main() {
    console.log('🌱 Starting seed process...');
    console.log(`📋 Placeholder data: ${SEED_INCLUDE_PLACEHOLDERS ? 'ENABLED' : 'DISABLED'}`);

    // 1. Seed dioceses using upsert
    // 2. Seed parishes using upsert (with name_city_state unique constraint)
    // 3. Seed ministries using upsert (with name_parishId unique constraint)
    // 4. Seed admin user using upsert
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
```

## Usage

### Development (with placeholders):
```bash
npm run db:seed
```

### Production (without placeholders):
```bash
SEED_INCLUDE_PLACEHOLDERS=false npm run db:seed
```

## Data Sources

### Real Ministries
- Cathedral of Our Lady of the Angels: olacathedral.org
- St. Monica Catholic Community: stmonica.net
- Our Lady of Loretto: lorettola.org

### Placeholder Ministries
- 6 generic ministries marked with `[PLACEHOLDER]` prefix
- Added to ALL parishes for testing purposes
- FAKE DATA - should be excluded in production

## Next Steps

1. Delete `seed.ts` (the corrupted file)
2. Create new `seed.ts` with the implementation outlined above
3. Test the seed script:
   ```bash
   cd server
   npm run db:seed
   ```
4. Verify all data is properly upserted
5. Delete `seed.ts.backup` once verified

## Migration Path

If you need to switch from the old seed file:

1. The old file is backed up as `seed.ts.backup`
2. Data files are already created in `data/` directory
3. New seed implementation uses same Prisma schema
4. No database migration needed
