/*
  Warnings:

  - You are about to drop the column `wasteItemId` on the `Manifest` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Manifest` table. All the data in the column will be lost.
  - Changed the type of `type` on the `Company` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Manifest" DROP CONSTRAINT "Manifest_wasteItemId_fkey";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Manifest" DROP COLUMN "wasteItemId",
DROP COLUMN "weight";

-- CreateTable
CREATE TABLE "ManifestItem" (
    "id" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "manifestId" TEXT NOT NULL,
    "wasteItemId" TEXT NOT NULL,

    CONSTRAINT "ManifestItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ManifestItem" ADD CONSTRAINT "ManifestItem_manifestId_fkey" FOREIGN KEY ("manifestId") REFERENCES "Manifest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManifestItem" ADD CONSTRAINT "ManifestItem_wasteItemId_fkey" FOREIGN KEY ("wasteItemId") REFERENCES "WasteItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
