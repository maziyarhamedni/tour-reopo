-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('easy', 'medium', 'difficult');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'GUIDE';

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "review" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "tour" TEXT NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tours" (
    "id" SERIAL NOT NULL,
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
    "startLocation" TEXT NOT NULL,
    "guideId" TEXT[],

    CONSTRAINT "tours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" SERIAL NOT NULL,
    "tourId" INTEGER NOT NULL,
    "type" VARCHAR(5) NOT NULL DEFAULT 'Point',
    "coordinates" DOUBLE PRECISION[],
    "address" TEXT,
    "description" TEXT,
    "day" INTEGER,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TourGuides" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TourGuides_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "tours_name_key" ON "tours"("name");

-- CreateIndex
CREATE INDEX "_TourGuides_B_index" ON "_TourGuides"("B");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TourGuides" ADD CONSTRAINT "_TourGuides_A_fkey" FOREIGN KEY ("A") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TourGuides" ADD CONSTRAINT "_TourGuides_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
