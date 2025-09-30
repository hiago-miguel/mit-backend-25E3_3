import { Request, Response } from 'express';
import { EmployeeService } from '../Domain/EmployeeService';

export class EmployeeController {
  private employeeService: EmployeeService;

  constructor() {
    this.employeeService = new EmployeeService();
  }

  createEmployee = async (req: Request, res: Response): Promise<void> => {
    try {
      const employee = await this.employeeService.createEmployee(req.body);
      res.status(201).json({
        message: 'Empregado criado com sucesso',
        employee
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getEmployeeById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const employee = await this.employeeService.getEmployeeById(id);
      
      if (!employee) {
        res.status(404).json({ error: 'Empregado não encontrado ou ID inválido' });
        return;
      }

      res.json(employee);
    } catch {
      res.status(500).json({ error: 'Erro ao buscar empregado' });
    }
  };

  getAllEmployees = async (req: Request, res: Response): Promise<void> => {
    try {
      const employees = await this.employeeService.getAllEmployees();
      res.json(employees);
    } catch {
      res.status(500).json({ error: 'Erro ao buscar empregados' });
    }
  };

  updateEmployee = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const employee = await this.employeeService.updateEmployee(id, req.body);
      
      if (!employee) {
        res.status(404).json({ error: 'Empregado não encontrado ou ID inválido' });
        return;
      }

      res.json({
        message: 'Empregado atualizado com sucesso',
        employee
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  deleteEmployee = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const success = await this.employeeService.deleteEmployee(id);
      
      if (!success) {
        res.status(404).json({ error: 'Empregado não encontrado ou ID inválido' });
        return;
      }

      res.json({ message: 'Empregado deletado com sucesso' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
