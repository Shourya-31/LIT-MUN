-- CreateTable
CREATE TABLE "Announcement" (
    "id" UUID NOT NULL,
    "heading" VARCHAR(200) NOT NULL,
    "subheading" VARCHAR(300),
    "content" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Announcement_isPublished_publishedAt_idx"
    ON "Announcement" ("isPublished", "publishedAt");

-- CreateIndex
CREATE INDEX "Announcement_isPublished_createdAt_idx"
    ON "Announcement" ("isPublished", "createdAt");
