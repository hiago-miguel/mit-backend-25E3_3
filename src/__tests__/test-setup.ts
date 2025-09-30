import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer;

// Configurar MongoDB em memória para testes
beforeAll(async () => {
  try {
    // Criar instância do MongoDB em memória sem porta específica
    mongoServer = await MongoMemoryServer.create({
      instance: {
        dbName: 'test-mit-backend'
      }
    });

    // Obter URI de conexão
    const mongoUri = mongoServer.getUri();
    
    // Conectar ao MongoDB em memória
    await mongoose.connect(mongoUri);
    
    console.log('✅ MongoDB em memória iniciado para testes');
  } catch (error) {
    console.error('❌ Erro ao configurar MongoDB para testes:', error);
    throw error;
  }
});

// Limpar dados após cada teste
afterEach(async () => {
  try {
    // Limpar todas as coleções
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  } catch (error) {
    console.error('Erro ao limpar dados de teste:', error);
  }
});

// Fechar conexão após todos os testes
afterAll(async () => {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
    console.log('✅ MongoDB em memória finalizado');
  } catch (error) {
    console.error('❌ Erro ao finalizar MongoDB para testes:', error);
  }
});
