# Amazon Eco - Gestão e Rastreabilidade Ambiental (PIM)

## Visão Geral
O **Amazon Eco** é uma aplicação Full-stack de alta performance desenvolvida para gerenciar a emissão, o transporte e a destinação de resíduos industriais via **Manifesto de Transporte de Resíduos (MTR)** no **Polo Industrial de Manaus (PIM)**. 

O foco do projeto foi integrar o **Next.js 15 (App Router)** com o **NestJS**, utilizando o **Prisma ORM** para gerenciar o banco de dados **PostgreSQL**. A plataforma conta com autenticação segura via JWT, dashboard analítico com acompanhamento de volumetria em tempo real, visualização da logística fluvial no Rio Negro e módulo para emissão e impressão de documentos oficiais de auditoria ambiental.

## Funcionalidades Principais
- **Dashboard Analítico:** Balanço de massa de resíduos do polo em toneladas, distribuição por tipologia e eficiência operacional.
- **Rastreabilidade Fluvial:** Monitoramento interativo de cargas em trânsito no eixo fluvial do Rio Negro (Samsung, Honda, Yamaha, Panasonic).
- **Gestão de Manifestos (MTR):** Emissão de guias, controle de ciclo de vida (*Emitido*, *Em Trânsito*, *Destinado*) e exportação de dados em CSV.
- **Central de Auditoria & Conformidade:** Notificações automáticas sobre prazos de transporte fluvial (SLA), cargas pendentes e alertas regulatórios.
- **Espelho Oficial de Impressão:** Geração de documento para auditoria em formato A4 com identificador único e autenticação digital.
- **Gestão de Empresas:** Cadastro e validação de indústrias geradoras, transportadoras e destinadoras licenciadas.

## Tecnologias Utilizadas
- **Frontend:** Next.js 15, React 19, Tailwind CSS, Recharts, Lucide Icons.
- **Backend:** NestJS, TypeScript, Passport JWT, Class Validator.
- **Banco de Dados & ORM:** PostgreSQL, Prisma ORM, Docker Compose.

## Pré-requisitos
- Node.js (Versão 18 ou superior recomendada).
- Docker e Docker Compose (Para o banco PostgreSQL local).
- Git.

## Instruções de Instalação

1. Clone o repositório para a sua máquina local:
```bash
git clone https://github.com/pedzmrx/amazoneco-erp.git
cd amazoneco-erp
```

2. Inicie o banco de dados PostgreSQL com Docker:
```bash
docker-compose up -d
```

3. Configure as variáveis de ambiente:
> Copie os arquivos de exemplo para criar os arquivos `.env`:
> - Em `amazon-eco-api/.env.example` ➔ crie `amazon-eco-api/.env`
> - Em `amazon-eco-web/.env.example` ➔ crie `amazon-eco-web/.env.local`

4. Instale as dependências e configure o Backend (API):
```bash
cd amazon-eco-api
npm install
```

5. Configurações do Banco de Dados com Prisma:
```bash
npx prisma migrate dev
npx prisma db seed
```

6. Instale as dependências do Frontend (Web):
```bash
cd ../amazon-eco-web
npm install
```

## Executando o Projeto Localmente

### Opção 1: Via scripts da raiz (Recomendado)
Na pasta raiz do projeto (`amazoneco-erp`):
```bash
npm run dev:api     # Inicia o backend na porta 3333
npm run dev:web     # Inicia o frontend na porta 3000
```

### Opção 2: Iniciando separadamente
- **Backend:** `cd amazon-eco-api && npm run start:dev` (Acessível em `http://localhost:3333`)
- **Frontend:** `cd amazon-eco-web && npm run dev` (Acessível em `http://localhost:3000`)

## Credenciais de Acesso (Seed)
Para acessar a plataforma com os dados populados pelo seed:
- **E-mail:** `admin@amazoneco.com`
- **Senha:** `admin123`

---

## Autor
Desenvolvido por **Pedro Moraes**  
[GitHub](https://github.com/pedzmrx) • [LinkedIn](https://www.linkedin.com/in/pedrmrs)
