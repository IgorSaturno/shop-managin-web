# 🛍️ Shop Managing - Sistema de Gerenciamento de Lojas

> ⚠️ **Status do Projeto**: Este projeto está atualmente em desenvolvimento ativo. Funcionalidades podem ser adicionadas, modificadas ou removidas durante o processo de desenvolvimento.

Um sistema completo de gerenciamento de lojas desenvolvido com arquitetura moderna, oferecendo controle total sobre produtos, pedidos, clientes e operações comerciais.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [API](#api)
- [Contribuição](#contribuição)
- [Licença](#licença)

## 🎯 Sobre o Projeto

O **Shop Managing** é uma plataforma completa de e-commerce desenvolvida para atender às necessidades de pequenas e médias empresas. O sistema oferece uma solução robusta para gerenciamento de lojas online, com foco em simplicidade de uso e funcionalidades avançadas.

### Principais Características

- **Multi-loja**: Suporte a múltiplas lojas com gerenciamento independente
- **Dashboard Intuitivo**: Interface moderna com métricas em tempo real
- **Gestão Completa**: Produtos, pedidos, clientes e estoque
- **Sistema de Autenticação**: Seguro e flexível
- **Relatórios Avançados**: Análises detalhadas de vendas e performance

## ✨ Funcionalidades

### 🏪 Gestão de Lojas

- Criação e configuração de múltiplas lojas
- Perfis de loja personalizáveis
- Sistema de permissões por loja

### 📦 Gestão de Produtos

- Cadastro completo de produtos com imagens
- Controle de estoque em tempo real
- Categorização e tags
- Marcas e características
- Produtos em destaque
- Status de disponibilidade

### 🛒 Gestão de Pedidos

- Acompanhamento completo do ciclo de vida do pedido
- Status detalhados: pendente, aprovado, em processamento, em trânsito, entregue
- Gestão de cancelamentos e reembolsos
- Histórico completo de pedidos

### 👥 Gestão de Clientes

- Cadastro e perfil de clientes
- Histórico de compras
- Dados de entrega
- Sistema de cupons de desconto

### 📊 Dashboard e Relatórios

- Métricas de vendas em tempo real
- Receita mensal e diária
- Produtos mais populares
- Análise de pedidos cancelados
- Gráficos interativos

### 🎫 Sistema de Cupons

- Cupons de desconto personalizáveis
- Aplicação por produto ou categoria
- Controle de validade e uso

## 🏗️ Arquitetura

O projeto segue uma arquitetura moderna com separação clara entre frontend e backend:

```
shop-managin-web/
├── backend/          # API REST com Bun + Elysia
├── frontend/         # Interface React + TypeScript
└── README.md
```

### Backend (API)

- **Runtime**: Bun
- **Framework**: Elysia
- **Database**: PostgreSQL com Drizzle ORM
- **Autenticação**: JWT + Links de autenticação
- **Validação**: Zod

### Frontend (Interface)

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand + React Query
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod

## 🛠️ Tecnologias

### Backend

- **Bun** - Runtime JavaScript rápido
- **Elysia** - Framework web moderno
- **PostgreSQL** - Banco de dados relacional
- **Drizzle ORM** - ORM type-safe
- **Zod** - Validação de schemas
- **Nodemailer** - Envio de emails
- **Day.js** - Manipulação de datas

### Frontend

- **React 18** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS
- **shadcn/ui** - Componentes UI
- **React Query** - Gerenciamento de estado
- **React Hook Form** - Formulários
- **Recharts** - Gráficos e visualizações
- **Axios** - Cliente HTTP

## 📁 Estrutura do Projeto

```
shop-managin-web/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── schema/          # Schemas do banco de dados
│   │   │   ├── connection.ts    # Conexão com PostgreSQL
│   │   │   └── migrate.ts       # Migrações
│   │   ├── http/
│   │   │   ├── routes/          # Rotas da API
│   │   │   ├── auth.ts          # Middleware de autenticação
│   │   │   └── server.ts        # Servidor Elysia
│   │   └── lib/
│   │       └── mail.ts          # Configuração de email
│   ├── drizzle/                 # Migrações do Drizzle
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/          # Componentes React
│   │   ├── pages/               # Páginas da aplicação
│   │   ├── api/                 # Cliente da API
│   │   ├── hooks/               # Custom hooks
│   │   └── lib/                 # Utilitários
│   └── package.json
└── README.md
```

## 🚀 Instalação

### Pré-requisitos

- **Node.js** 18+ ou **Bun** 1.0+
- **PostgreSQL** 12+
- **Git**

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/shop-managin-web.git
cd shop-managin-web
```

### 2. Configure o Backend

```bash
cd backend

# Instale as dependências
bun install

# Configure as variáveis de ambiente
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/shop_managing"
JWT_SECRET="seu-jwt-secret-aqui"
MAIL_HOST="smtp.gmail.com"
MAIL_PORT="587"
MAIL_USER="seu-email@gmail.com"
MAIL_PASS="sua-senha-de-app"
```

### 3. Configure o Banco de Dados

```bash
# Execute as migrações
bun run migrate

# (Opcional) Popule com dados de exemplo
bun run seed
```

### 4. Configure o Frontend

```bash
cd ../frontend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
```

Edite o arquivo `.env`:

```env
VITE_API_URL="http://localhost:3000"
```

## ⚙️ Configuração

### Variáveis de Ambiente - Backend

| Variável       | Descrição                 | Exemplo                                    |
| -------------- | ------------------------- | ------------------------------------------ |
| `DATABASE_URL` | URL de conexão PostgreSQL | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET`   | Chave secreta para JWT    | `sua-chave-secreta-aqui`                   |
| `MAIL_HOST`    | Servidor SMTP             | `smtp.gmail.com`                           |
| `MAIL_PORT`    | Porta SMTP                | `587`                                      |
| `MAIL_USER`    | Email para envio          | `seu-email@gmail.com`                      |
| `MAIL_PASS`    | Senha do email            | `sua-senha-de-app`                         |

### Variáveis de Ambiente - Frontend

| Variável       | Descrição          | Exemplo                 |
| -------------- | ------------------ | ----------------------- |
| `VITE_API_URL` | URL da API backend | `http://localhost:3000` |

## 🎮 Uso

### Desenvolvimento

#### Backend

```bash
cd backend
bun run dev
```

#### Frontend

```bash
cd frontend
npm run dev
```

### Produção

#### Backend

```bash
cd backend
bun run build
bun run start
```

#### Frontend

```bash
cd frontend
npm run build
```

## 📡 API

### Endpoints Principais

#### Autenticação

- `POST /auth/send-link` - Envia link de autenticação
- `GET /auth/authenticate/:token` - Autentica via link
- `POST /auth/sign-out` - Logout

#### Lojas

- `POST /stores` - Criar loja
- `GET /stores/managed` - Obter lojas gerenciadas

#### Produtos

- `GET /products` - Listar produtos
- `POST /products` - Criar produto
- `PUT /products/:id` - Atualizar produto
- `DELETE /products/:id` - Deletar produto

#### Pedidos

- `GET /orders` - Listar pedidos
- `GET /orders/:id` - Detalhes do pedido
- `PUT /orders/:id/approve` - Aprovar pedido
- `PUT /orders/:id/cancel` - Cancelar pedido

#### Dashboard

- `GET /metrics/month-orders` - Pedidos do mês
- `GET /metrics/month-revenue` - Receita do mês
- `GET /metrics/popular-products` - Produtos populares

### Exemplo de Uso

```bash
# Autenticação
curl -X POST http://localhost:3000/auth/send-link \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@loja.com"}'

# Listar produtos
curl -X GET http://localhost:3000/products \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código

- Use TypeScript em todo o projeto
- Siga as convenções do ESLint configurado
- Escreva testes para novas funcionalidades
- Mantenha a documentação atualizada

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/seu-usuario/shop-managin-web/issues)
- **Email**: suporte@shopmanaging.com
- **Documentação**: [Wiki do Projeto](https://github.com/seu-usuario/shop-managin-web/wiki)

---

**Desenvolvido com ❤️ para facilitar o gerenciamento de lojas online**
