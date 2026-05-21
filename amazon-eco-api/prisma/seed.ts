import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.manifesto.deleteMany({});
  await prisma.user.deleteMany({});

  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Erick Eco Admin',
      email: 'admin@amazoneco.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Usuário administrador criado com sucesso!');

  await prisma.manifesto.createMany({
    data: [
      {
        numeroMtr: 'MTR-2026-908123',
        empresa: 'Samsung Eletrônicos da Amazônia',
        tipoResiduo: 'Sucata Eletrônica (Placas/Circuitos)',
        quantidade: 1250.5,
        status: 'EMITIDO',
        criadoPorId: admin.id,
      },
      {
        numeroMtr: 'MTR-2026-443219',
        empresa: 'Moto Honda da Amazônia',
        tipoResiduo: 'Óleos Lubrificantes Usados',
        quantidade: 850.0,
        status: 'EM_TRANSITO',
        criadoPorId: admin.id,
      },
      {
        numeroMtr: 'MTR-2026-771102',
        empresa: 'Panasonic do Brasil',
        tipoResiduo: 'Pilhas e Baterias Industriais',
        quantidade: 2100.2,
        status: 'RECEBIDO',
        criadoPorId: admin.id,
      },
    ],
  });

  console.log('Banco de dados populado com 3 Manifestos de teste!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });