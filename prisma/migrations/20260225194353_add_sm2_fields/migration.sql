/*
  Warnings:

  - You are about to drop the column `mastered` on the `WordProgress` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,wordId]` on the table `WordProgress` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "WordProgress" DROP COLUMN "mastered",
ALTER COLUMN "interval" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "WordProgress_userId_wordId_key" ON "WordProgress"("userId", "wordId");
