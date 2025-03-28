-- AlterTable
ALTER TABLE "User" ALTER COLUMN "passwordChengeAt" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
