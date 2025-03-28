/*
  Warnings:

  - You are about to drop the column `guideId` on the `tours` table. All the data in the column will be lost.
  - You are about to drop the column `startLocation` on the `tours` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tours" DROP COLUMN "guideId",
DROP COLUMN "startLocation";

-- CreateTable
CREATE TABLE "StartLocation" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "coordinates" DOUBLE PRECISION[],
    "address" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,

    CONSTRAINT "StartLocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StartLocation_tourId_key" ON "StartLocation"("tourId");

-- AddForeignKey
ALTER TABLE "StartLocation" ADD CONSTRAINT "StartLocation_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
