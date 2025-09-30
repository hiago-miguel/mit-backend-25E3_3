import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../Domain/AuthService';

export class AuthMiddleware {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        res.status(401).json({ 
          error: 'Token de autenticação não fornecido',
          code: 'MISSING_TOKEN'
        });
        return;
      }

      if (!authHeader.startsWith('Bearer ')) {
        res.status(401).json({ 
          error: 'Formato de token inválido. Use: Bearer <token>',
          code: 'INVALID_TOKEN_FORMAT'
        });
        return;
      }

      const token = authHeader.substring(7);
      
      if (!token || token.trim().length === 0) {
        res.status(401).json({ 
          error: 'Token vazio',
          code: 'EMPTY_TOKEN'
        });
        return;
      }

      const user = await this.authService.verifyToken(token);
      (req as any).user = user;
      next();
    } catch (error: any) {
      console.error('Erro de autenticação:', error);
      
      if (error.message === 'Token expirado') {
        res.status(401).json({ 
          error: 'Token expirado. Faça login novamente.',
          code: 'TOKEN_EXPIRED'
        });
      } else if (error.message === 'Token inválido') {
        res.status(401).json({ 
          error: 'Token inválido. Verifique o token fornecido.',
          code: 'INVALID_TOKEN'
        });
      } else if (error.message === 'Token não ativo') {
        res.status(401).json({ 
          error: 'Token não ativo. Aguarde a data de ativação.',
          code: 'TOKEN_NOT_ACTIVE'
        });
      } else if (error.message === 'Usuário não encontrado') {
        res.status(401).json({ 
          error: 'Usuário associado ao token não encontrado.',
          code: 'USER_NOT_FOUND'
        });
      } else {
        res.status(401).json({ 
          error: 'Erro de autenticação. Token inválido ou expirado.',
          code: 'AUTH_ERROR'
        });
      }
    }
  };

  requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;
    
    if (!user || user.role !== 'admin') {
      res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
      return;
    }

    next();
  };
}

export const auth = new AuthMiddleware();
