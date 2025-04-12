/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Tour` will be added. If there are existing duplicate values, this will fail.
  - Made the column `slug` on table `Tour` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Tour" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tour_slug_key" ON "Tour"("slug");
