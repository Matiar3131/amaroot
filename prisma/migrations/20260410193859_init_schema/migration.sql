-- CreateEnum
CREATE TYPE "NodeType" AS ENUM ('PR_ADDR', 'PM_ADDR', 'SCHOOL', 'COLLEGE', 'UNIVERSITY', 'WORK_EXP', 'SKILL', 'BIO', 'ORG_DIV', 'ORG_DEPT', 'ORG_SEC', 'ORG_UNIT', 'ORG_LINE', 'ORG_DESIG', 'OFFICE_LOC', 'NOMINEE', 'OTHER');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('INDIVIDUAL', 'COMPANY');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nid" TEXT,
    "address" TEXT,
    "userType" "UserRole" NOT NULL DEFAULT 'INDIVIDUAL',
    "image" TEXT,
    "companyName" TEXT,
    "officeEmail" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "referredById" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Node" (
    "id" TEXT NOT NULL,
    "type" "NodeType" NOT NULL DEFAULT 'SCHOOL',
    "title" TEXT NOT NULL,
    "year" TEXT,
    "subject" TEXT,
    "metadata" JSONB,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isCommon" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "institutionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Node_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NodeList" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'INDIVIDUAL',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "NodeList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Institution" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "NodeType" NOT NULL,
    "district" TEXT,

    CONSTRAINT "Institution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "District" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "District_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Upazila" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,

    CONSTRAINT "Upazila_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_nid_key" ON "User"("nid");

-- CreateIndex
CREATE UNIQUE INDEX "User_officeEmail_key" ON "User"("officeEmail");

-- CreateIndex
CREATE INDEX "Node_title_idx" ON "Node"("title");

-- CreateIndex
CREATE INDEX "Node_type_idx" ON "Node"("type");

-- CreateIndex
CREATE UNIQUE INDEX "NodeList_name_key" ON "NodeList"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Institution_name_key" ON "Institution"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_name_key" ON "Subject"("name");

-- CreateIndex
CREATE UNIQUE INDEX "District_name_key" ON "District"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_referredById_fkey" FOREIGN KEY ("referredById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Node" ADD CONSTRAINT "Node_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Node" ADD CONSTRAINT "Node_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upazila" ADD CONSTRAINT "Upazila_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
