-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastReviewDate" TIMESTAMP(3),
ADD COLUMN     "streak" INTEGER NOT NULL DEFAULT 0;
