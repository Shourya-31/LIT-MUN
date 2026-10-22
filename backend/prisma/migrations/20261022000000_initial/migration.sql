-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('DELEGATE', 'SECRETARIAT', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'DISABLED');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED', 'WAITLISTED', 'REJECTED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "AllocationStatus" AS ENUM ('ALLOCATED', 'UNALLOCATED');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "fullName" VARCHAR(160) NOT NULL,
    "phone" VARCHAR(40) NOT NULL,
    "institution" VARCHAR(200) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'DELEGATE',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "emailVerifiedAt" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DelegateApplication" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "reference" VARCHAR(32) NOT NULL,
    "fullName" VARCHAR(160) NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "phone" VARCHAR(40) NOT NULL,
    "institution" VARCHAR(200) NOT NULL,
    "academicLevel" VARCHAR(40) NOT NULL,
    "city" VARCHAR(120) NOT NULL,
    "country" VARCHAR(120) NOT NULL,
    "experienceLevel" VARCHAR(40) NOT NULL,
    "pastConferences" VARCHAR(2000),
    "statementOfIntent" VARCHAR(4000),
    "agreedToTerms" BOOLEAN NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'SUBMITTED',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "reviewedAt" TIMESTAMP(3),
    "reviewerId" UUID,
    "reviewNote" VARCHAR(2000),

    CONSTRAINT "DelegateApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Committee" (
    "id" UUID NOT NULL,
    "code" VARCHAR(16) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "category" VARCHAR(120) NOT NULL,
    "description" VARCHAR(1000) NOT NULL,

    CONSTRAINT "Committee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Portfolio" (
    "id" UUID NOT NULL,
    "committeeId" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationCommitteePreference" (
    "id" UUID NOT NULL,
    "applicationId" UUID NOT NULL,
    "committeeId" UUID NOT NULL,
    "rank" INTEGER NOT NULL,

    CONSTRAINT "ApplicationCommitteePreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationPortfolioPreference" (
    "id" UUID NOT NULL,
    "preferenceId" UUID NOT NULL,
    "portfolioId" UUID NOT NULL,
    "rank" INTEGER NOT NULL,

    CONSTRAINT "ApplicationPortfolioPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Allocation" (
    "id" UUID NOT NULL,
    "applicationId" UUID NOT NULL,
    "committeeId" UUID NOT NULL,
    "portfolioId" UUID NOT NULL,
    "assignedById" UUID NOT NULL,
    "status" "AllocationStatus" NOT NULL DEFAULT 'ALLOCATED',
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Allocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshSession" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "familyId" UUID NOT NULL,
    "tokenHash" VARCHAR(64) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailVerificationToken" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "tokenHash" VARCHAR(64) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailVerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "tokenHash" VARCHAR(64) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" UUID NOT NULL,
    "actorId" UUID NOT NULL,
    "action" VARCHAR(80) NOT NULL,
    "resourceType" VARCHAR(80) NOT NULL,
    "resourceId" VARCHAR(80) NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_status_idx" ON "User"("role", "status");

-- CreateIndex
CREATE UNIQUE INDEX "DelegateApplication_userId_key" ON "DelegateApplication"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DelegateApplication_reference_key" ON "DelegateApplication"("reference");

-- CreateIndex
CREATE INDEX "DelegateApplication_status_submittedAt_idx" ON "DelegateApplication"("status", "submittedAt");

-- CreateIndex
CREATE INDEX "DelegateApplication_email_idx" ON "DelegateApplication"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Committee_code_key" ON "Committee"("code");

-- CreateIndex
CREATE INDEX "Portfolio_committeeId_idx" ON "Portfolio"("committeeId");

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_committeeId_name_key" ON "Portfolio"("committeeId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationCommitteePreference_applicationId_rank_key" ON "ApplicationCommitteePreference"("applicationId", "rank");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationCommitteePreference_applicationId_committeeId_key" ON "ApplicationCommitteePreference"("applicationId", "committeeId");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationPortfolioPreference_preferenceId_rank_key" ON "ApplicationPortfolioPreference"("preferenceId", "rank");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationPortfolioPreference_preferenceId_portfolioId_key" ON "ApplicationPortfolioPreference"("preferenceId", "portfolioId");

-- CreateIndex
CREATE UNIQUE INDEX "Allocation_applicationId_key" ON "Allocation"("applicationId");

-- CreateIndex
CREATE INDEX "Allocation_committeeId_status_idx" ON "Allocation"("committeeId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshSession_tokenHash_key" ON "RefreshSession"("tokenHash");

-- CreateIndex
CREATE INDEX "RefreshSession_userId_expiresAt_idx" ON "RefreshSession"("userId", "expiresAt");

-- CreateIndex
CREATE INDEX "RefreshSession_familyId_revokedAt_idx" ON "RefreshSession"("familyId", "revokedAt");

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerificationToken_tokenHash_key" ON "EmailVerificationToken"("tokenHash");

-- CreateIndex
CREATE INDEX "EmailVerificationToken_userId_expiresAt_idx" ON "EmailVerificationToken"("userId", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash");

-- CreateIndex
CREATE INDEX "PasswordResetToken_userId_expiresAt_idx" ON "PasswordResetToken"("userId", "expiresAt");

-- CreateIndex
CREATE INDEX "AuditLog_actorId_createdAt_idx" ON "AuditLog"("actorId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_resourceType_resourceId_idx" ON "AuditLog"("resourceType", "resourceId");

-- AddForeignKey
ALTER TABLE "DelegateApplication" ADD CONSTRAINT "DelegateApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DelegateApplication" ADD CONSTRAINT "DelegateApplication_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_committeeId_fkey" FOREIGN KEY ("committeeId") REFERENCES "Committee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationCommitteePreference" ADD CONSTRAINT "ApplicationCommitteePreference_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "DelegateApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationCommitteePreference" ADD CONSTRAINT "ApplicationCommitteePreference_committeeId_fkey" FOREIGN KEY ("committeeId") REFERENCES "Committee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationPortfolioPreference" ADD CONSTRAINT "ApplicationPortfolioPreference_preferenceId_fkey" FOREIGN KEY ("preferenceId") REFERENCES "ApplicationCommitteePreference"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationPortfolioPreference" ADD CONSTRAINT "ApplicationPortfolioPreference_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Allocation" ADD CONSTRAINT "Allocation_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "DelegateApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Allocation" ADD CONSTRAINT "Allocation_committeeId_fkey" FOREIGN KEY ("committeeId") REFERENCES "Committee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Allocation" ADD CONSTRAINT "Allocation_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Allocation" ADD CONSTRAINT "Allocation_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshSession" ADD CONSTRAINT "RefreshSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailVerificationToken" ADD CONSTRAINT "EmailVerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

