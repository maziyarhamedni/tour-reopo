/*
  Warnings:

  - The primary key for the `Review` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `tour` on the `Review` table. All the data in the column will be lost.
  - The primary key for the `_TourGuides` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `locations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `tours` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `tourId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_TourGuides" DROP CONSTRAINT "_TourGuides_A_fkey";

-- DropForeignKey
ALTER TABLE "locations" DROP CONSTRAINT "locations_tourId_fkey";

-- AlterTable
ALTER TABLE "Review" DROP CONSTRAINT "Review_pkey",
DROP COLUMN "tour",
ADD COLUMN     "tourId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Review_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Review_id_seq";

-- AlterTable
ALTER TABLE "_TourGuides" DROP CONSTRAINT "_TourGuides_AB_pkey",
ALTER COLUMN "A" SET DATA TYPE TEXT,
ADD CONSTRAINT "_TourGuides_AB_pkey" PRIMARY KEY ("A", "B");

-- AlterTable
ALTER TABLE "locations" DROP CONSTRAINT "locations_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "tourId" SET DATA TYPE TEXT,
ADD CONSTRAINT "locations_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "locations_id_seq";

-- AlterTable
ALTER TABLE "tours" DROP CONSTRAINT "tours_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "tours_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "tours_id_seq";

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TourGuides" ADD CONSTRAINT "_TourGuides_A_fkey" FOREIGN KEY ("A") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;
