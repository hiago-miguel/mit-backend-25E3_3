import { User, CreateUserRequest } from '../Domain/index';
import { UserModel, IUser } from './schemas';
import { logging } from './logging';
import mongoose from 'mongoose';

export class UserRepository {
  private static instance: UserRepository;

  private constructor() {}

  public static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }

  async create(userData: CreateUserRequest): Promise<User> {
    try {
      const user = new UserModel({
        ...userData,
        role: userData.role || 'user'
      });

      const savedUser = await user.save();
      return this.mapToUser(savedUser);
    } catch (error) {
      logging.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    try {
      const user = await UserModel.findOne({ username }).exec();
      return user ? this.mapToUser(user) : null;
    } catch (error) {
      logging.error('Erro ao buscar usuário por username:', error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await UserModel.findOne({ email }).exec();
      return user ? this.mapToUser(user) : null;
    } catch (error) {
      logging.error('Erro ao buscar usuário por email:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
      }
      
      const user = await UserModel.findById(id).exec();
      return user ? this.mapToUser(user) : null;
    } catch (error) {
      logging.error('Erro ao buscar usuário por ID:', error);
      throw error;
    }
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    try {
      const users = await UserModel.find({}, { password: 0 }).exec();
      return users.map(user => this.mapToUserWithoutPassword(user));
    } catch (error) {
      logging.error('Erro ao buscar todos os usuários:', error);
      throw error;
    }
  }

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
      }
      
      const user = await UserModel.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).exec();
      
      return user ? this.mapToUser(user) : null;
    } catch (error) {
      logging.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return false;
      }
      
      const result = await UserModel.findByIdAndDelete(id).exec();
      return !!result;
    } catch (error) {
      logging.error('Erro ao deletar usuário:', error);
      throw error;
    }
  }

  async count(): Promise<number> {
    try {
      return await UserModel.countDocuments().exec();
    } catch (error) {
      logging.error('Erro ao contar usuários:', error);
      throw error;
    }
  }

  async existsByUsername(username: string): Promise<boolean> {
    try {
      const count = await UserModel.countDocuments({ username }).exec();
      return count > 0;
    } catch (error) {
      logging.error('Erro ao verificar existência de username:', error);
      throw error;
    }
  }

  async existsByEmail(email: string): Promise<boolean> {
    try {
      const count = await UserModel.countDocuments({ email }).exec();
      return count > 0;
    } catch (error) {
      logging.error('Erro ao verificar existência de email:', error);
      throw error;
    }
  }

  // Inicializar admin
  async initializeDefaultAdmin(): Promise<void> {
    try {
      const adminExists = await this.findByUsername('admin');
      if (!adminExists) {
        await this.create({
          username: 'admin',
          email: 'admin@infnet.edu.br',
          password: '$2a$12$kUOdc7Ehki0cNkDScCNhrec3KRxpaJnV5foZgbSblnRsAuOP4pfTa', // admin123
          role: 'admin'
        });
        logging.info('Admin padrão criado com sucesso');
      }
    } catch (error) {
      logging.error('Erro ao inicializar admin padrão:', error);
      throw error;
    }
  }

  // Método para testes - limpa todos os usuários exceto o admin
  async clearTestData(): Promise<void> {
    try {
      await UserModel.deleteMany({ role: { $ne: 'admin' } }).exec();
    } catch (error) {
      logging.error('Erro ao limpar dados de teste:', error);
      throw error;
    }
  }

  private mapToUser(mongoUser: IUser): User {
    return {
      id: mongoUser._id.toString(),
      username: mongoUser.username,
      email: mongoUser.email,
      password: mongoUser.password,
      role: mongoUser.role,
      createdAt: mongoUser.createdAt,
      updatedAt: mongoUser.updatedAt
    };
  }

  private mapToUserWithoutPassword(mongoUser: IUser): Omit<User, 'password'> {
    const user = this.mapToUser(mongoUser);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
