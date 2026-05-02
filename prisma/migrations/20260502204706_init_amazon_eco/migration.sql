-- CreateEnum
CREATE TYPE "CompanyType" AS ENUM ('GENERATOR', 'TRANSPORTER', 'DESTINATOR');

-- CreateEnum
CREATE TYPE "ManifestStatus" AS ENUM ('PENDING', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "type" "CompanyType" NOT NULL,
    "address" TEXT NOT NULL,
    "licenseNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WasteItem" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "class" TEXT NOT NULL,
    "unit" TEXT NOT NULL,

    CONSTRAINT "WasteItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Manifest" (
    "id" TEXT NOT NULL,
    "status" "ManifestStatus" NOT NULL DEFAULT 'PENDING',
    "weight" DOUBLE PRECISION NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "generatorId" TEXT NOT NULL,
    "transporterId" TEXT NOT NULL,
    "destinatorId" TEXT NOT NULL,
    "wasteItemId" TEXT NOT NULL,

    CONSTRAINT "Manifest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_cnpj_key" ON "Company"("cnpj");

-- AddForeignKey
ALTER TABLE "Manifest" ADD CONSTRAINT "Manifest_generatorId_fkey" FOREIGN KEY ("generatorId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manifest" ADD CONSTRAINT "Manifest_transporterId_fkey" FOREIGN KEY ("transporterId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manifest" ADD CONSTRAINT "Manifest_destinatorId_fkey" FOREIGN KEY ("destinatorId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manifest" ADD CONSTRAINT "Manifest_wasteItemId_fkey" FOREIGN KEY ("wasteItemId") REFERENCES "WasteItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
