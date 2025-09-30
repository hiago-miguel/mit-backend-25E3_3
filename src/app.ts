import express from 'express';
import dotenv from 'dotenv';
import { configureExpress } from './Infra/express';
import { mongoConnection } from './Infra/mongodb';
import { UserRepository } from './Infra/UserRepository';
import authRoutes from './Api/authRoutes';
import userRoutes from './Api/users';
import employeeRoutes from './Api/employees';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar Express
configureExpress(app);

// Inicializar conexão com MongoDB
const initializeDatabase = async () => {
  try {
    await mongoConnection.connect();
    
    // Inicializar admin padrão
    const userRepository = UserRepository.getInstance();
    await userRepository.initializeDefaultAdmin();
    
    console.log('Aplicação inicializada com sucesso :)');
  } catch (error) {
    console.error('Erro ao inicializar aplicação:', error);
    process.exit(1);
  }
};

// Inicializar banco de dados
initializeDatabase();

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/employees', employeeRoutes);

app.get('/health', async (req: express.Request, res: express.Response) => {
  try {
    const mongoStatus = await mongoConnection.healthCheck();
    const status = mongoStatus ? 'OK' : 'DEGRADED';
    
    res.json({ 
      status,
      timestamp: new Date().toISOString(),
      database: {
        mongodb: mongoStatus ? 'connected' : 'disconnected'
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      database: {
        mongodb: 'error'
      },
      error: 'Health check failed'
    });
  }
});

app.all('*', (req: express.Request, res: express.Response) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const timestamp = new Date().toISOString();
  const errorId = Math.random().toString(36).substring(2, 15);
  
  console.error(`[${timestamp}] Error ID: ${errorId}`);
  console.error(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  console.error(`[${timestamp}] Error:`, err.stack);
  
  if (process.env.NODE_ENV === 'development') {
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      errorId,
      timestamp,
      message: err.message 
    });
  } else {
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      errorId,
      timestamp
    });
  }
});

export { app, PORT };
