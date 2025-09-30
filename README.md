# MIT Backend com Typescript 25E3_3

API Rest para RH!

## Características

- **Express v4** 
- **Autenticação JWT**
- **Validação de dados**
- **Persistência com MongoDB + Mongoose**
- **Middleware de logging**
- **Testes automatizados**
- **Arquitetura em camadas**
- **Documentação da API** 

## Stack

- **Backend**: Node.js + Express v4 + TypeScript
- **Banco de Dados**: MongoDB + Mongoose
- **Autenticação**: JWT + bcrypt
- **Validação**: express-validator
- **Testes**: Jest + MongoDB Memory Server
- **Linting**: ESLint
- **Segurança**: Helmet, CORS

## Pré-requisitos

- Node.js 22
- npm ou yarn
- MongoDB (local ou MongoDB Atlas)

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/hiago-miguel/mit-backend-25E3_3.git
cd mit-backend-25E3_3
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
PORT=3000
JWT_SECRET=sua-chave-secreta-aqui
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/mit-backend
```

### Configuração do MongoDB

#### Opção 1: Docker (Recomendado)
```bash
# Iniciar MongoDB com Docker Compose
npm run docker:up

# Ver logs do MongoDB
npm run docker:logs

# Parar MongoDB caso necessário
npm run docker:down

# Inicializar o MongoDB e MongoDB Express
npm run dev:docker
```

#### Opção 2: MongoDB Local
1. Instale o MongoDB localmente
2. Inicie o serviço MongoDB
3. Use a URI padrão: `mongodb://localhost:27017/mit-backend`
4. Execute o projeto:
```bash
# Desenvolvimento
npm run dev

# Prod
npm run build
npm start
```

## Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage
```

## Documentação da API

### Base URL
```
http://localhost:3000/api
```

### Endpoints de Autenticação

#### POST /auth/register
Cria um novo usuário.

**Body:**
```json
{
  "username": "usuario",
  "email": "usuario@example.com",
  "password": "senha123"
}
```

#### POST /auth/login
Realiza login do usuário.

**Body:**
```json
{
  "username": "usuario",
  "password": "senha123"
}
```

**Response:**
```json
{
  "message": "Login realizado com sucesso",
  "token": "jwt-token-aqui",
  "user": {
    "id": "user-id",
    "username": "usuario",
    "email": "usuario@example.com",
    "role": "user"
  }
}
```

### Endpoints de Usuários (Admin apenas)

#### GET /users
Lista todos os usuários (requer autenticação admin).

#### GET /users/:id
Busca usuário por ID (requer autenticação admin).

### Endpoints de Empregados (Autenticados)

#### POST /employees
Cria um novo empregado.

**Body:**
```json
{
  "fullName": "Marcos Silva",
  "jobRole": "Desenvolvedor",
  "department": "TI",
  "contact": "marcos@example.com"
}
```

#### GET /employees
Lista todos os empregados.

#### GET /employees/:id
Busca empregado por ID.

#### PUT /employees/:id
Atualiza empregado existente.

**Body:**
```json
{
  "fullName": "Marcos Silva Santos",
  "jobRole": "Desenvolvedor Senior"
}
```

#### DELETE /employees/:id
Remove empregado.

## Autenticação

Todas as rotas (exceto auth) requerem autenticação via header:

```
Authorization: Bearer <jwt-token>
```

### Validações de Token

A API retorna mensagens de erro específicas para diferentes cenários de token:

#### Códigos de Erro de Autenticação:

- **MISSING_TOKEN**: Token não fornecido
- **INVALID_TOKEN_FORMAT**: Formato inválido (deve ser "Bearer <token>")
- **EMPTY_TOKEN**: Token vazio
- **TOKEN_EXPIRED**: Token expirado (24h)
- **INVALID_TOKEN**: Token inválido ou malformado
- **TOKEN_NOT_ACTIVE**: Token não ativo
- **USER_NOT_FOUND**: Usuário associado ao token não encontrado
- **AUTH_ERROR**: Erro geral de autenticação

#### Exemplos de Respostas de Erro:

```json
// Token expirado
{
  "error": "Token expirado. Faça login novamente.",
  "code": "TOKEN_EXPIRED"
}

// Token inválido
{
  "error": "Token inválido. Verifique o token fornecido.",
  "code": "INVALID_TOKEN"
}

// Formato inválido
{
  "error": "Formato de token inválido. Use: Bearer <token>",
  "code": "INVALID_TOKEN_FORMAT"
}
```

## Exemplos de Uso com cURL

### 1. Usuário admin já configurado
O usuário admin já está configurado automaticamente:
- **Username:** admin
- **Password:** admin123
- **Role:** admin

### 2. Cadastrar novo usuário
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "novousuario",
    "email": "novo@example.com",
    "password": "NovaSenh@123"
  }'
```

### 3. Fazer login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### 4. Criar empregado (com token)
```bash
# Substitua <TOKEN> pelo token recebido no login
curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "fullName": "Marcos Silva",
    "jobRole": "Desenvolvedor",
    "department": "TI",
    "contact": "marcos@example.com"
  }'
```

### 5. Listar empregados
```bash
curl -X GET http://localhost:3000/api/employees \
  -H "Authorization: Bearer <TOKEN>"
```

### 6. Buscar empregado por ID
```bash
# Substitua <EMPLOYEE_ID> pelo ID do empregado
curl -X GET http://localhost:3000/api/employees/<EMPLOYEE_ID> \
  -H "Authorization: Bearer <TOKEN>"
```

### 7. Atualizar empregado
```bash
curl -X PUT http://localhost:3000/api/employees/<EMPLOYEE_ID> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "fullName": "Marcos Silva Santos",
    "jobRole": "Desenvolvedor Senior"
  }'
```

### 8. Deletar empregado
```bash
curl -X DELETE http://localhost:3000/api/employees/<EMPLOYEE_ID> \
  -H "Authorization: Bearer <TOKEN>"
```

### 9. Listar usuários (admin apenas)
```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer <TOKEN>"
```

### 10. Buscar usuário por ID (admin apenas)
```bash
# Substitua <USER_ID> pelo ID do usuário
curl -X GET http://localhost:3000/api/users/<USER_ID> \
  -H "Authorization: Bearer <TOKEN>"
```

### 11. Health check
```bash
curl -X GET http://localhost:3000/health
```

## Exemplos de Validação

### Testando Validações de Token

#### Token expirado
```bash
curl -X GET http://localhost:3000/api/employees \
  -H "Authorization: Bearer expired-token"
# Resposta: {"error":"Token expirado. Faça login novamente.","code":"TOKEN_EXPIRED"}
```

#### Token inválido
```bash
curl -X GET http://localhost:3000/api/employees \
  -H "Authorization: Bearer invalid-token-123"
# Resposta: {"error":"Token inválido. Verifique o token fornecido.","code":"INVALID_TOKEN"}
```

#### Formato inválido
```bash
curl -X GET http://localhost:3000/api/employees \
  -H "Authorization: InvalidFormat token123"
# Resposta: {"error":"Formato de token inválido. Use: Bearer <token>","code":"INVALID_TOKEN_FORMAT"}
```

#### Sem token
```bash
curl -X GET http://localhost:3000/api/employees
# Resposta: {"error":"Token de autenticação não fornecido","code":"MISSING_TOKEN"}
```

### Testando Validações de Dados

#### Senha inválida (cadastro de usuário)
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "123"
  }'
# Resposta: {"errors":[{"msg":"Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial"}]}
```

#### Email inválido
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "email-invalido",
    "password": "Test123!"
  }'
# Resposta: {"errors":[{"msg":"Email deve ser válido"}]}
```

#### Nome de empregado com números
```bash
curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "fullName": "Marcos123 Silva",
    "jobRole": "Desenvolvedor",
    "department": "TI",
    "contact": "marcos@example.com"
  }'
# Resposta: {"errors":[{"msg":"Nome completo deve conter apenas letras e espaços"}]}
```

#### Contato inválido
```bash
curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "fullName": "Marcos Silva",
    "jobRole": "Desenvolvedor",
    "department": "TI",
    "contact": "contato-invalido"
  }'
# Resposta: {"errors":[{"msg":"Contato deve ser um email válido ou telefone (ex: +5584999999999)"}]}
```

## Fluxo Completo de Exemplo

### 1. Login e obtenção do token
```bash
# Fazer login
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}' | \
  jq -r '.token')

echo "Token obtido: $TOKEN"
```

### 2. Criar empregado com o token
```bash
# Criar empregado
curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "fullName": "Maria Santos",
    "jobRole": "DevOps",
    "department": "TI",
    "contact": "maria@empresa.com"
  }'
```

### 3. Listar empregados
```bash
# Listar todos os empregados
curl -X GET http://localhost:3000/api/employees \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### 4. Cadastrar novo usuário
```bash
# Cadastrar usuário
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "novousuario",
    "email": "novo@empresa.com",
    "password": "NovaSenh@123"
  }'
```

### 5. Listar usuários (admin)
```bash
# Listar todos os usuários
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer $TOKEN" | jq .
```

## Estrutura do Projeto

```
src/
├── Api/               # Controllers, Routes (Interface Adapters)
├── Domain/            # Services, Types, Business Logic (Core)
├── Infra/             # Repositories, Middlewares, Config (Infrastructure)
│   ├── schemas/       # Schemas do Mongoose
│   │   ├── UserSchema.ts
│   │   ├── EmployeeSchema.ts
│   │   └── index.ts
│   ├── mongodb.ts     # Configuração de conexão MongoDB
│   ├── UserRepository.ts
│   └── EmployeeRepository.ts
├── commands/          # Comandos CLI
├── app.ts             # Configuração da aplicação
└── index.ts           # Ponto de entrada
```

## Arquitetura MongoDB

### Schemas e Modelos

#### User Schema
- **Campos**: username, email, password, role, timestamps
- **Validações**: Validação de formato, tamanho
- **Índices**: username, email, role

#### Employee Schema
- **Campos**: fullName, jobRole, department, contact, timestamps
- **Validações**: Validação de formato, tamanho, regex
- **Índices**: fullName, department, jobRole, contact
- **Busca**: Índice de texto para busca full-text

### Operações de Banco de Dados

#### CRUD Completo
- **Create**: Criação de usuários e empregados
- **Read**: Busca por ID, listagem, filtros
- **Update**: Atualização com validação
- **Delete**: Exclusão com verificação de existência

#### Funcionalidades
- **Busca por departamento**: Filtro de empregados por departamento
- **Busca por cargo**: Filtro de empregados por cargo
- **Busca textual**: Busca full-text em nome, cargo e departamento
- **Contagem**: Contadores para estatísticas
- **Listas únicas**: Departamentos e cargos únicos


## Validações de Dados

### Validações de Usuário:

- **Username**: 3-30 caracteres, apenas letras, números e underscore
- **Email**: Formato válido de email
- **Password**: 8-128 caracteres, deve conter:
  - 1 letra minúscula
  - 1 letra maiúscula  
  - 1 número
  - 1 caractere especial (@$!%*?&)
- **Role**: Apenas 'admin' ou 'user'

### Validações de Empregado:

- **fullName**: 2-100 caracteres, apenas letras e espaços
- **jobRole**: 2-100 caracteres, letras, espaços, hífens e pontos
- **department**: 2-100 caracteres, letras, espaços, hífens e pontos
- **contact**: 5-100 caracteres, email válido ou telefone (ex: +5584999999999)

## Logs

A API registra automaticamente:
- Todas as requisições HTTP
- Tempo de resposta
- Status codes
- Erros e exceções

## Scripts

### Desenvolvimento
- `npm run dev`: Executa em modo desenvolvimento
- `npm run build`: Compila TypeScript
- `npm start`: Executa em produção
- `npm test`: Executa testes
- `npm run lint`: Verifica código

### Docker
- `npm run docker:up`: Inicia MongoDB com Docker Compose
- `npm run docker:down`: Para MongoDB
- `npm run docker:logs`: Mostra logs do MongoDB
- `npm run docker:restart`: Reinicia MongoDB
- `npm run docker:clean`: Remove containers e volumes
- `npm run dev:docker`: Inicia MongoDB + aplicação automaticamente

## Docker Compose

O projeto inclui um `docker-compose.yml` configurado com:

- **MongoDB 7.0.24**: Banco de dados principal
- **Mongo Express v1.0.2**: Um dashboard para gerenciar o MongoDB
- **Volumes persistentes**

### Enpoints
- **API**: http://localhost:3000
- **Mongo Express**: http://localhost:8081 (admin/admin123)
- **MongoDB**: localhost:27017

### Credenciais do MongoDB
- **Usuário**: mit-user
- **Senha**: mit-password
- **Banco**: mit-backend
