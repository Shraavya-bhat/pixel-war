/*
  Warnings:

  - You are about to drop the column `owner` on the `Tile` table. All the data in the column will be lost.
  - You are about to drop the column `tileId` on the `Tile` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `x` to the `Tile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `y` to the `Tile` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Tile_tileId_key";

-- AlterTable
ALTER TABLE "Tile" DROP COLUMN "owner",
DROP COLUMN "tileId",
ADD COLUMN     "x" INTEGER NOT NULL,
ADD COLUMN     "y" INTEGER NOT NULL;

-- DropTable
DROP TABLE "User";
