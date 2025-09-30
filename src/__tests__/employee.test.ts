import { EmployeeService } from '../Domain/EmployeeService';
import { EmployeeRepository } from '../Infra/EmployeeRepository';

describe('EmployeeService', () => {
  let employeeService: EmployeeService;
  let employeeRepository: EmployeeRepository;

  beforeEach(() => {
    employeeRepository = EmployeeRepository.getInstance();
    employeeService = new EmployeeService(employeeRepository);
  });

  describe('createEmployee', () => {
    it('Deve criar um novo empregado com sucesso', async () => {
      const employeeData = {
        fullName: 'Marcos Silva',
        jobRole: 'Desenvolvedor',
        department: 'TI',
        contact: 'marcos@example.com'
      };

      const mockEmployee = {
        id: '123',
        ...employeeData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(employeeRepository, 'create').mockResolvedValue(mockEmployee as any);

      const result = await employeeService.createEmployee(employeeData);

      expect(result.fullName).toBe(employeeData.fullName);
      expect(result.jobRole).toBe(employeeData.jobRole);
      expect(result.department).toBe(employeeData.department);
      expect(result.contact).toBe(employeeData.contact);
      expect(result.id).toBeDefined();
    });
  });

  describe('getEmployeeById', () => {
    it('Deve retornar o empregado pelo id', async () => {
      const employeeData = {
        fullName: 'Marcos Silva',
        jobRole: 'Desenvolvedor',
        department: 'TI',
        contact: 'marcos@example.com'
      };

      const mockEmployee = {
        id: '123',
        ...employeeData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(employeeRepository, 'findById').mockResolvedValue(mockEmployee as any);

      const found = await employeeService.getEmployeeById('123');

      expect(found).toBeDefined();
      expect(found?.id).toBe('123');
    });

    it('Deve retornar null para empregado inexistente', async () => {
      jest.spyOn(employeeRepository, 'findById').mockResolvedValue(null);

      const result = await employeeService.getEmployeeById('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('updateEmployee', () => {
    it('Deve atualizar o empregado com sucesso', async () => {
      const employeeData = {
        fullName: 'Marcos Silva',
        jobRole: 'Desenvolvedor',
        department: 'TI',
        contact: 'marcos@example.com'
      };

      const mockEmployee = {
        id: '123',
        ...employeeData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const updatedEmployee = {
        ...mockEmployee,
        fullName: 'Marcos Silva Santos'
      };

      jest.spyOn(employeeRepository, 'findById').mockResolvedValue(mockEmployee as any);
      jest.spyOn(employeeRepository, 'update').mockResolvedValue(updatedEmployee as any);

      const updated = await employeeService.updateEmployee('123', {
        fullName: 'Marcos Silva Santos'
      });

      expect(updated?.fullName).toBe('Marcos Silva Santos');
    });

    it('Deve lançar um erro para empregado inexistente', async () => {
      jest.spyOn(employeeRepository, 'findById').mockResolvedValue(null);

      await expect(employeeService.updateEmployee('nonexistent', {
        fullName: 'New Name'
      })).rejects.toThrow('Empregado não encontrado');
    });
  });

  describe('deleteEmployee', () => {
    it('Deve deletar o empregado com sucesso', async () => {
      const mockEmployee = {
        id: '123',
        fullName: 'Marcos Silva',
        jobRole: 'Desenvolvedor',
        department: 'TI',
        contact: 'marcos@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(employeeRepository, 'findById').mockResolvedValue(mockEmployee as any);
      jest.spyOn(employeeRepository, 'delete').mockResolvedValue(true);

      const result = await employeeService.deleteEmployee('123');

      expect(result).toBe(true);
    });

    it('Deve lançar um erro para empregado inexistente', async () => {
      jest.spyOn(employeeRepository, 'findById').mockResolvedValue(null);

      await expect(employeeService.deleteEmployee('nonexistent')).rejects.toThrow('Empregado não encontrado');
    });
  });
});
