import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const emailAdmin = 'admin@amazoneco.com.br'; 
  const senhaPlana = 'Admin@Eco2026';         

  const usuarioExistente = await prisma.user.findUnique({
    where: { email: emailAdmin },
  });

  if (!usuarioExistente) {
    const senhaCriptografada = await bcrypt.hash(senhaPlana, 10);

    await prisma.user.create({
      data: {
        name: 'Administrador Amazon Eco',
        email: emailAdmin,
        password: senhaCriptografada,
        role: 'ADMIN', 
      },
    });

    console.log('Usuário administrador criado com sucesso via Seed!');
    console.log(`Logins: ${emailAdmin} | Senha: ${senhaPlana}`);
  } else {
    console.log('O usuário administrador já existe no banco de dados.');
  }
}

main()
  .catch((e) => {
    console.error('Erro ao rodar o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });