/*
  Warnings:

  - A unique constraint covering the columns `[nationalDexId]` on the table `Pokemon` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Pokemon" ADD COLUMN "nationalDexId" INTEGER;
ALTER TABLE "Pokemon" ADD COLUMN "regionalDexId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Pokemon_nationalDexId_key" ON "Pokemon"("nationalDexId");
