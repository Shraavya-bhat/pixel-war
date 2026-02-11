/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Tile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tile" DROP COLUMN "updatedAt";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
