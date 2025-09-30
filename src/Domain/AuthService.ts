import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, LoginRequest, CreateUserRequest, UserWithoutPassword } from './index';
import { UserRepository } from '../Infra/UserRepository';

export class AuthService {
  constructor(private userRepository: UserRepository = UserRepository.getInstance()) {}

  async register(userData: CreateUserRequest): Promise<UserWithoutPassword> {
    const [existingUser, existingEmail] = await Promise.all([
      this.userRepository.findByUsername(userData.username),
      this.userRepository.findByEmail(userData.email)
    ]);

    if (existingUser) {
      throw new Error('Username já existe');
    }

    if (existingEmail) {
      throw new Error('Email já existe');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword
    });

    const { password, ...userWithoutPassword } = user;
    void password; // Explicitly mark as used to avoid ESLint warning
    return userWithoutPassword;
  }

  async login(credentials: LoginRequest): Promise<{ token: string; user: UserWithoutPassword }> {
    const user = await this.userRepository.findByUsername(credentials.username);
    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    const isValidPassword = await bcrypt.compare(credentials.password, user.password);
    if (!isValidPassword) {
      throw new Error('Credenciais inválidas');
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    const { password, ...userWithoutPassword } = user;
    void password; // Explicitly mark as used to avoid ESLint warning
    return { token, user: userWithoutPassword };
  }

  async verifyToken(token: string): Promise<User> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
      const user = await this.userRepository.findById(decoded.userId);
      
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return user;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token expirado');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Token inválido');
      } else if (error instanceof jwt.NotBeforeError) {
        throw new Error('Token não ativo');
      } else {
        throw new Error('Token inválido');
      }
    }
  }
}
