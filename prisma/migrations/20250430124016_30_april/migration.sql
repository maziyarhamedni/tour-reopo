/*
  Warnings:

  - You are about to drop the column `expiredTime` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resetPassword` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_resetPassword_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "expiredTime",
DROP COLUMN "resetPassword";

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "cardHash" TEXT NOT NULL,
    "tourTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_userId_tourId_key" ON "Order"("userId", "tourId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
