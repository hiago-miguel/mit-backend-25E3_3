import { Employee, CreateEmployeeRequest, UpdateEmployeeRequest } from '../Domain/index';
import { EmployeeModel, IEmployee } from './schemas';
import { logging } from './logging';
import mongoose from 'mongoose';

export class EmployeeRepository {
  private static instance: EmployeeRepository;

  private constructor() {}

  public static getInstance(): EmployeeRepository {
    if (!EmployeeRepository.instance) {
      EmployeeRepository.instance = new EmployeeRepository();
    }
    return EmployeeRepository.instance;
  }

  async create(employeeData: CreateEmployeeRequest): Promise<Employee> {
    try {
      const employee = new EmployeeModel(employeeData);
      const savedEmployee = await employee.save();
      return this.mapToEmployee(savedEmployee);
    } catch (error) {
      logging.error('Erro ao criar empregado:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Employee | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
      }
      
      const employee = await EmployeeModel.findById(id).exec();
      return employee ? this.mapToEmployee(employee) : null;
    } catch (error) {
      logging.error('Erro ao buscar empregado por ID:', error);
      throw error;
    }
  }

  async findAll(): Promise<Employee[]> {
    try {
      const employees = await EmployeeModel.find().sort({ createdAt: -1 }).exec();
      return employees.map(employee => this.mapToEmployee(employee));
    } catch (error) {
      logging.error('Erro ao buscar todos os empregados:', error);
      throw error;
    }
  }

  async update(id: string, updates: UpdateEmployeeRequest): Promise<Employee | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
      }
      
      const employee = await EmployeeModel.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).exec();
      
      return employee ? this.mapToEmployee(employee) : null;
    } catch (error) {
      logging.error('Erro ao atualizar empregado:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return false;
      }
      
      const result = await EmployeeModel.findByIdAndDelete(id).exec();
      return !!result;
    } catch (error) {
      logging.error('Erro ao deletar empregado:', error);
      throw error;
    }
  }

  async findByDepartment(department: string): Promise<Employee[]> {
    try {
      const employees = await EmployeeModel.find({ department }).sort({ fullName: 1 }).exec();
      return employees.map(employee => this.mapToEmployee(employee));
    } catch (error) {
      logging.error('Erro ao buscar empregados por departamento:', error);
      throw error;
    }
  }

  async findByJobRole(jobRole: string): Promise<Employee[]> {
    try {
      const employees = await EmployeeModel.find({ jobRole }).sort({ fullName: 1 }).exec();
      return employees.map(employee => this.mapToEmployee(employee));
    } catch (error) {
      logging.error('Erro ao buscar empregados por cargo:', error);
      throw error;
    }
  }

  async search(query: string): Promise<Employee[]> {
    try {
      const employees = await EmployeeModel.find({
        $text: { $search: query }
      }, {
        score: { $meta: 'textScore' }
      }).sort({
        score: { $meta: 'textScore' }
      }).exec();
      
      return employees.map(employee => this.mapToEmployee(employee));
    } catch (error) {
      logging.error('Erro ao buscar empregados:', error);
      throw error;
    }
  }

  async count(): Promise<number> {
    try {
      return await EmployeeModel.countDocuments().exec();
    } catch (error) {
      logging.error('Erro ao contar empregados:', error);
      throw error;
    }
  }

  async countByDepartment(department: string): Promise<number> {
    try {
      return await EmployeeModel.countDocuments({ department }).exec();
    } catch (error) {
      logging.error('Erro ao contar empregados por departamento:', error);
      throw error;
    }
  }

  async getDepartments(): Promise<string[]> {
    try {
      const departments = await EmployeeModel.distinct('department').exec();
      return departments.sort();
    } catch (error) {
      logging.error('Erro ao buscar departamentos:', error);
      throw error;
    }
  }

  async getJobRoles(): Promise<string[]> {
    try {
      const jobRoles = await EmployeeModel.distinct('jobRole').exec();
      return jobRoles.sort();
    } catch (error) {
      logging.error('Erro ao buscar cargos:', error);
      throw error;
    }
  }

  // Método para testes - limpa todos os empregados
  async clearTestData(): Promise<void> {
    try {
      await EmployeeModel.deleteMany({}).exec();
    } catch (error) {
      logging.error('Erro ao limpar dados de teste:', error);
      throw error;
    }
  }

  private mapToEmployee(mongoEmployee: IEmployee): Employee {
    return {
      id: mongoEmployee._id.toString(),
      fullName: mongoEmployee.fullName,
      jobRole: mongoEmployee.jobRole,
      department: mongoEmployee.department,
      contact: mongoEmployee.contact,
      createdAt: mongoEmployee.createdAt,
      updatedAt: mongoEmployee.updatedAt
    };
  }
}
