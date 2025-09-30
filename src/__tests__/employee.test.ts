import { EmployeeService } from '../Domain/EmployeeService';
import { EmployeeRepository } from '../Infra/EmployeeRepository';

describe('EmployeeService', () => {
  let employeeService: EmployeeService;
  let employeeRepository: EmployeeRepository;

  beforeEach(async () => {
    employeeRepository = EmployeeRepository.getInstance();
    await employeeRepository.clearTestData(); // Limpa dados de testes anteriores
    employeeService = new EmployeeService(employeeRepository);
  });

  describe('createEmployee', () => {
    it('should create a new employee successfully', async () => {
      const employeeData = {
        fullName: 'Marcos Silva',
        jobRole: 'Desenvolvedor',
        department: 'TI',
        contact: 'marcos@example.com'
      };

      const result = await employeeService.createEmployee(employeeData);

      expect(result.fullName).toBe(employeeData.fullName);
      expect(result.jobRole).toBe(employeeData.jobRole);
      expect(result.department).toBe(employeeData.department);
      expect(result.contact).toBe(employeeData.contact);
      expect(result.id).toBeDefined();
    });
  });

  describe('getEmployeeById', () => {
    it('should return employee by id', async () => {
      const employeeData = {
        fullName: 'Marcos Silva',
        jobRole: 'Desenvolvedor',
        department: 'TI',
        contact: 'marcos@example.com'
      };

      const created = await employeeService.createEmployee(employeeData);
      const found = await employeeService.getEmployeeById(created.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it('should return null for non-existent employee', async () => {
      const result = await employeeService.getEmployeeById('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('updateEmployee', () => {
    it('should update employee successfully', async () => {
      const employeeData = {
        fullName: 'Marcos Silva',
        jobRole: 'Desenvolvedor',
        department: 'TI',
        contact: 'marcos@example.com'
      };

      const created = await employeeService.createEmployee(employeeData);
      const updated = await employeeService.updateEmployee(created.id, {
        fullName: 'Marcos Silva Santos'
      });

      expect(updated?.fullName).toBe('Marcos Silva Santos');
    });

    it('should throw error for non-existent employee', async () => {
      await expect(employeeService.updateEmployee('nonexistent', {
        fullName: 'New Name'
      })).rejects.toThrow('Empregado não encontrado');
    });
  });

  describe('deleteEmployee', () => {
    it('should delete employee successfully', async () => {
      const employeeData = {
        fullName: 'Marcos Silva',
        jobRole: 'Desenvolvedor',
        department: 'TI',
        contact: 'marcos@example.com'
      };

      const created = await employeeService.createEmployee(employeeData);
      const result = await employeeService.deleteEmployee(created.id);

      expect(result).toBe(true);
    });

    it('should throw error for non-existent employee', async () => {
      await expect(employeeService.deleteEmployee('nonexistent')).rejects.toThrow('Empregado não encontrado');
    });
  });
});
