-- CreateEnum
CREATE TYPE "MinistryType" AS ENUM ('YOUTH_MINISTRY', 'YOUNG_ADULT', 'ADULT_EDUCATION', 'BIBLE_STUDY', 'PRAYER_GROUP', 'CHOIR_MUSIC', 'LITURGICAL_MINISTRY', 'SOCIAL_JUSTICE', 'COMMUNITY_SERVICE', 'FOOD_PANTRY', 'SENIORS_MINISTRY', 'MENS_GROUP', 'WOMENS_GROUP', 'MARRIAGE_FAMILY', 'BEREAVEMENT', 'ADDICTION_RECOVERY', 'RELIGIOUS_EDUCATION', 'RCIA', 'CONFIRMATION_PREP', 'FIRST_COMMUNION_PREP', 'BAPTISM_PREP', 'MARRIAGE_PREP', 'KNIGHTS_OF_COLUMBUS', 'ALTAR_SOCIETY', 'ST_VINCENT_DE_PAUL', 'PASTORAL_CARE', 'HOSPITALITY', 'MAINTENANCE_GROUNDS', 'FUNDRAISING', 'RETREAT_MINISTRY', 'MISSION_OUTREACH', 'OTHER');

-- CreateEnum
CREATE TYPE "AgeGroup" AS ENUM ('CHILDREN', 'TEENAGERS', 'YOUNG_ADULTS', 'ADULTS', 'SENIORS', 'FAMILIES', 'ALL_AGES');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'PARISH_ADMIN', 'USER');

-- CreateTable
CREATE TABLE "dioceses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "website" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dioceses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parishes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "pastor" TEXT,
    "massSchedule" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dioceseId" TEXT NOT NULL,

    CONSTRAINT "parishes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ministries" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "MinistryType" NOT NULL,
    "ageGroups" "AgeGroup"[],
    "languages" TEXT[],
    "schedule" JSONB NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "isOngoing" BOOLEAN NOT NULL DEFAULT true,
    "contactName" TEXT,
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "requiresRegistration" BOOLEAN NOT NULL DEFAULT false,
    "registrationDeadline" TIMESTAMP(3),
    "maxParticipants" INTEGER,
    "currentParticipants" INTEGER DEFAULT 0,
    "isAccessible" BOOLEAN NOT NULL DEFAULT true,
    "requirements" TEXT[],
    "materials" TEXT[],
    "cost" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "parishId" TEXT NOT NULL,

    CONSTRAINT "ministries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dioceses_name_key" ON "dioceses"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "parishes" ADD CONSTRAINT "parishes_dioceseId_fkey" FOREIGN KEY ("dioceseId") REFERENCES "dioceses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ministries" ADD CONSTRAINT "ministries_parishId_fkey" FOREIGN KEY ("parishId") REFERENCES "parishes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
