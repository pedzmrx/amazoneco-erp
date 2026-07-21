import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.manifesto.deleteMany({});
  await prisma.company.deleteMany({});
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

  await prisma.company.createMany({
    data: [
      {
        name: 'Samsung Eletrônicos da Amazônia',
        cnpj: '14200166000166',
        type: 'GENERATOR',
        address: 'Av. dos Oitis, 1460 - Distrito Industrial II, Manaus - AM',
        licenseNumber: 'IPAAM-LO-2025/089',
      },
      {
        name: 'Moto Honda da Amazônia',
        cnpj: '04337168000148',
        type: 'GENERATOR',
        address: 'Av. Mário Ypiranga, 3151 - Distrito Industrial I, Manaus - AM',
        licenseNumber: 'IPAAM-LO-2024/112',
      },
      {
        name: 'Panasonic do Brasil',
        cnpj: '04403408000165',
        type: 'GENERATOR',
        address: 'Rua Buriti, 1200 - Distrito Industrial I, Manaus - AM',
        licenseNumber: 'IPAAM-LO-2025/003',
      },
      {
        name: 'Logística Ambiental da Amazônia',
        cnpj: '08123456000188',
        type: 'TRANSPORTER',
        address: 'Rua Atid, 45 - Armando Mendes, Manaus - AM',
        licenseNumber: 'IPAAM-LT-2025/301',
      },
      {
        name: 'Amazon EcoTratamento Final',
        cnpj: '10987654000199',
        type: 'DESTINATOR',
        address: 'BR-174, Km 12 - Zona Rural, Manaus - AM',
        licenseNumber: 'IPAAM-LD-2024/050',
      },
    ],
  });

  console.log('Empresas do PIM cadastradas com sucesso!');

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
      {
        numeroMtr: 'MTR-2026-104928',
        empresa: 'Samsung Eletrônicos da Amazônia',
        tipoResiduo: 'Embalagens Plásticas Industriais (PP/PE)',
        quantidade: 430.8,
        status: 'DESTINADO',
        criadoPorId: admin.id,
      },
    ],
  });

  console.log('Banco de dados populado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });