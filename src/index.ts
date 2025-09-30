import { app, PORT } from './app';

app.listen(PORT, () => {
  const timestamp = new Date().toISOString();
  const nodeVersion = process.version;
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  console.log('='.repeat(60));
  console.log(`Servidor iniciado em ${timestamp}`);
  console.log(`Porta: ${PORT}`);
  console.log(`Ambiente: ${nodeEnv}`);
  console.log(`Node.js: ${nodeVersion}`);
  console.log('='.repeat(60));
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API Auth: http://localhost:${PORT}/api/auth`);
  console.log(`API Users: http://localhost:${PORT}/api/users`);
  console.log(`API Employees: http://localhost:${PORT}/api/employees`);
  console.log('='.repeat(60));
});
