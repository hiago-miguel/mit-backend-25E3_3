import { AuthService } from '../Domain/AuthService';
import { UserRepository } from '../Infra/UserRepository';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    userRepository = UserRepository.getInstance();
    await userRepository.clearTestData(); // Limpa dados de testes anteriores
    authService = new AuthService(userRepository);
  });

  describe('register', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const result = await authService.register(userData);

      expect(result.username).toBe(userData.username);
      expect(result.email).toBe(userData.email);
      expect(result.role).toBe('user');
      expect(result).not.toHaveProperty('password');
    });

    it('should throw error if username already exists', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      await authService.register(userData);

      await expect(authService.register(userData)).rejects.toThrow('Username já existe');
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      await authService.register(userData);

      const result = await authService.login({
        username: 'testuser',
        password: 'password123'
      });

      expect(result.token).toBeDefined();
      expect(result.user.username).toBe('testuser');
    });

    it('should throw error with invalid credentials', async () => {
      await expect(authService.login({
        username: 'nonexistent',
        password: 'wrongpassword'
      })).rejects.toThrow('Credenciais inválidas');
    });
  });
});
