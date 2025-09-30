/* Script de inicialização do MongoDB
   Este script é executado automaticamente quando o container MongoDB é criado
   Referência: https://hub.docker.com/_/mongo#initializing-a-fresh-instance
*/

// Conectar ao banco de dados da aplicação
db = db.getSiblingDB('mit-backend');

// Criar usuário da aplicação
db.createUser({
  user: 'mit-user',
  pwd: 'mit-password',
  roles: [
    {
      role: 'readWrite',
      db: 'mit-backend'
    }
  ]
});

// Criar coleções com índices
db.createCollection('users');
db.createCollection('employees');

// Criar índices para performance
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "role": 1 });

db.employees.createIndex({ "fullName": 1 });
db.employees.createIndex({ "department": 1 });
db.employees.createIndex({ "jobRole": 1 });
db.employees.createIndex({ "contact": 1 });

// Índice de texto para busca
db.employees.createIndex({
  "fullName": "text",
  "jobRole": "text", 
  "department": "text"
});

print('Banco de dados mit-backend inicializado com sucesso!');
print('Usuário da aplicação: mit-user');
print('Senha da aplicação: mit-password');
print('Dashboard: http://localhost:8081');
