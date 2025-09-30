import { Employee, CreateEmployeeRequest, UpdateEmployeeRequest } from './index';
import { EmployeeRepository } from '../Infra/EmployeeRepository';

export class EmployeeService {
  constructor(private employeeRepository: EmployeeRepository = EmployeeRepository.getInstance()) {}

  async createEmployee(employeeData: CreateEmployeeRequest): Promise<Employee> {
    return await this.employeeRepository.create(employeeData);
  }

  async getEmployeeById(id: string): Promise<Employee | null> {
    return await this.employeeRepository.findById(id);
  }

  async getAllEmployees(): Promise<Employee[]> {
    return await this.employeeRepository.findAll();
  }

  async updateEmployee(id: string, updates: UpdateEmployeeRequest): Promise<Employee | null> {
    if (!id || id.trim().length === 0) {
      throw new Error('ID do empregado é obrigatório, não pode ser vazio');
    }

    const existingEmployee = await this.employeeRepository.findById(id);
    if (!existingEmployee) {
      throw new Error('Empregado não encontrado ou ID inválido');
    }

    const hasUpdates = Object.keys(updates).some(key => updates[key as keyof UpdateEmployeeRequest] !== undefined);
    if (!hasUpdates) {
      throw new Error('Nenhuma atualização fornecida');
    }

    return await this.employeeRepository.update(id, updates);
  }

  async deleteEmployee(id: string): Promise<boolean> {
    if (!id || id.trim().length === 0) {
      throw new Error('ID do empregado é obrigatório, não pode ser vazio');
    }

    const existingEmployee = await this.employeeRepository.findById(id);
    if (!existingEmployee) {
      throw new Error('Empregado não encontrado ou ID inválido');
    }

    return await this.employeeRepository.delete(id);
  }
}
