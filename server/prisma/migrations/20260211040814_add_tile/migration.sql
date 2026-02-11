-- CreateTable
CREATE TABLE "Tile" (
    "id" SERIAL NOT NULL,
    "tileId" INTEGER NOT NULL,
    "owner" TEXT,
    "color" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tile_tileId_key" ON "Tile"("tileId");
