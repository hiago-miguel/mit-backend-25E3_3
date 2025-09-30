import { Request, Response } from 'express';
import { AuthService } from '../Domain/AuthService';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.authService.register(req.body);
      res.status(201).json({
        message: 'Usuário criado com sucesso',
        user
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.authService.login(req.body);
      res.json({
        message: 'Login realizado com sucesso',
        ...result
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  };
}
