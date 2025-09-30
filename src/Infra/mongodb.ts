import mongoose from 'mongoose';
import { logging } from './logging';

class MongoDBConnection {
  private static instance: MongoDBConnection;
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): MongoDBConnection {
    if (!MongoDBConnection.instance) {
      MongoDBConnection.instance = new MongoDBConnection();
    }
    return MongoDBConnection.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      logging.info('MongoDB já está conectado');
      return;
    }

    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mit-backend';
      
      await mongoose.connect(mongoUri);
      
      this.isConnected = true;
      logging.info('Conectado ao MongoDB com sucesso');
      
      mongoose.connection.on('error', (error) => {
        logging.error('Erro na conexão com MongoDB:', error);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        logging.warn('Desconectado do MongoDB');
        this.isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        logging.info('Reconectado ao MongoDB');
        this.isConnected = true;
      });

    } catch (error) {
      logging.error('Erro ao conectar com MongoDB:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      logging.info('MongoDB já está desconectado');
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      logging.info('Desconectado do MongoDB com sucesso');
    } catch (error) {
      logging.error('Erro ao desconectar do MongoDB:', error);
      throw error;
    }
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }

  public async healthCheck(): Promise<boolean> {
    try {
      if (!this.isConnected) {
        return false;
      }
      
      if (mongoose.connection.db) {
        await mongoose.connection.db.admin().ping();
        return true;
      }
      return false;
    } catch (error) {
      logging.error('Health check do MongoDB falhou:', error);
      return false;
    }
  }
}

export const mongoConnection = MongoDBConnection.getInstance();
