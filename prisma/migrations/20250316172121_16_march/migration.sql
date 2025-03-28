/*
  Warnings:

  - You are about to drop the `tours` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StartLocation" DROP CONSTRAINT "StartLocation_tourId_fkey";

-- DropForeignKey
ALTER TABLE "_TourGuides" DROP CONSTRAINT "_TourGuides_A_fkey";

-- DropForeignKey
ALTER TABLE "locations" DROP CONSTRAINT "locations_tourId_fkey";

-- DropTable
DROP TABLE "tours";

-- CreateTable
CREATE TABLE "Tour" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(40) NOT NULL,
    "slug" TEXT,
    "duration" INTEGER NOT NULL,
    "maxGroupSize" INTEGER NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "ratingsAverage" DOUBLE PRECISION NOT NULL DEFAULT 4.5,
    "ratingsQuantity" INTEGER NOT NULL DEFAULT 0,
    "price" DOUBLE PRECISION NOT NULL,
    "priceDiscount" DOUBLE PRECISION,
    "summary" TEXT NOT NULL,
    "description" TEXT,
    "imageCover" TEXT NOT NULL,
    "images" TEXT[],
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startDates" TIMESTAMP(3)[],
    "secretTour" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Tour_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tour_name_key" ON "Tour"("name");

-- AddForeignKey
ALTER TABLE "StartLocation" ADD CONSTRAINT "StartLocation_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TourGuides" ADD CONSTRAINT "_TourGuides_A_fkey" FOREIGN KEY ("A") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;
