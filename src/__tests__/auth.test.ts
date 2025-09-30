import { AuthService } from '../Domain/AuthService';
import { UserRepository } from '../Infra/UserRepository';

jest.mock('bcryptjs', () => ({
  hash: jest.fn((password) => Promise.resolve(`hashed_${password}`)),
  compare: jest.fn((password, hash) => Promise.resolve(password === 'password123'))
}));

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = UserRepository.getInstance();
    authService = new AuthService(userRepository);
  });

  describe('register', () => {
    it('Deve criar um novo usuário com sucesso', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const mockUser = {
        id: '123',
        username: userData.username,
        email: userData.email,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(userRepository, 'findByUsername').mockResolvedValue(null);
      jest.spyOn(userRepository, 'create').mockResolvedValue(mockUser as any);

      const result = await authService.register(userData);

      expect(result.username).toBe(userData.username);
      expect(result.email).toBe(userData.email);
      expect(result.role).toBe('user');
      expect(result).not.toHaveProperty('password');
    });

    it('Deve lançar um erro se o username já existir', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const existingUser = {
        id: '123',
        username: userData.username,
        email: userData.email,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(userRepository, 'findByUsername').mockResolvedValue(existingUser as any);

      await expect(authService.register(userData)).rejects.toThrow('Username já existe');
    });
  });

  describe('login', () => {
    it('Deve fazer login com sucesso com credenciais válidas', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const mockUser = {
        id: '123',
        username: userData.username,
        email: userData.email,
        password: '$2a$10$hashedpassword', // Senha hasheada
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(userRepository, 'findByUsername').mockResolvedValue(mockUser as any);

      const result = await authService.login({
        username: 'testuser',
        password: 'password123'
      });

      expect(result.token).toBeDefined();
      expect(result.user.username).toBe('testuser');
    });

    it('Deve lançar um erro com credenciais inválidas', async () => {
      jest.spyOn(userRepository, 'findByUsername').mockResolvedValue(null);

      await expect(authService.login({
        username: 'nonexistent',
        password: 'wrongpassword'
      })).rejects.toThrow('Credenciais inválidas');
    });
  });
});
