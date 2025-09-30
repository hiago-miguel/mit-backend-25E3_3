import { Request, Response } from 'express';
import { UserRepository } from '../Infra/UserRepository';

export class UserController {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = UserRepository.getInstance();
  }

  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.userRepository.findAll();
      res.json(users);
    } catch {
      res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
  };

  getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await this.userRepository.findById(id);
      
      if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }

      const { password, ...userWithoutPassword } = user;
      void password; // Explicitly mark as used to avoid ESLint warning
      res.json(userWithoutPassword);
    } catch {
      res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
  };
}
