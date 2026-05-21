-- CreateEnum
CREATE TYPE "StatusManifesto" AS ENUM ('EMITIDO', 'EM_TRANSITO', 'RECEBIDO', 'DESTINADO');

-- CreateTable
CREATE TABLE "manifestos" (
    "id" TEXT NOT NULL,
    "numeroMtr" TEXT NOT NULL,
    "empresa" TEXT NOT NULL,
    "tipoResiduo" TEXT NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,
    "status" "StatusManifesto" NOT NULL DEFAULT 'EMITIDO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "criadoPorId" TEXT NOT NULL,

    CONSTRAINT "manifestos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "manifestos_numeroMtr_key" ON "manifestos"("numeroMtr");

-- AddForeignKey
ALTER TABLE "manifestos" ADD CONSTRAINT "manifestos_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
