import { ValidationService } from './validation-service';
import { Employee, Position, Task } from '../shared/models/whoDoesWhat';

describe('ValidationService', () => {
  let service: ValidationService;

  beforeEach(() => {
    service = new ValidationService();
  });

  describe('normalizeDate', () => {
    it('should return YYYY-MM-DD if already in that format', () => {
      expect((service as any).normalizeDate('2025-01-01')).toBe('2025-01-01');
    });
    it('should convert DD.MM.YYYY to YYYY-MM-DD', () => {
      expect((service as any).normalizeDate('05.09.2025')).toBe('2025-09-05');
    });
    it('should return input if format is unrecognized', () => {
      expect((service as any).normalizeDate('2025/01/01')).toBe('2025/01/01');
    });
  });

  describe('normalizePeriod', () => {
    it('should normalize both start and end', () => {
      const period = { start: '05.09.2025', end: '2025-12-31' };
      expect(service.normalizePeriod(period)).toEqual({ start: '2025-09-05', end: '2025-12-31' });
    });
  });

  describe('validateEmployee', () => {
    it('should return error for duplicate employee name', () => {
      const employees: Employee[] = [{ id: 1, name: 'Test' }];
      const newEmp: Employee = { id: 2, name: 'test' };
      expect(service.validateEmployee(newEmp, employees)).toBe('En ansatt med dette navnet finnes allerede.');
    });
    it('should return null for unique employee', () => {
      const employees: Employee[] = [{ id: 1, name: 'Test' }];
      const newEmp: Employee = { id: 2, name: 'Unique' };
      expect(service.validateEmployee(newEmp, employees)).toBeNull();
    });
  });

  describe('validatePosition', () => {
    const base: Position = {
      id: 1, name: 'Dev', employeeId: 1,
      period: { start: '2025-01-01', end: '2025-12-31' }
    };
    it('should return error for duplicate position', () => {
      const positions = [base];
      const newPos = { ...base, id: 2 };
      expect(service.validatePosition(newPos, positions)).toBe('Duplikat stilling: samme navn og ansatt-id finnes allerede.');
    });
    it('should return error for overlapping period', () => {
      const positions = [base];
      const newPos = { ...base, id: 2, period: { start: '2025-06-01', end: '2026-01-01' } };
      expect(service.validatePosition(newPos, positions)).toBe('Overlappende periode for denne ansatt-id.');
    });
    it('should return null for valid position', () => {
      const positions = [base];
      const newPos = { ...base, id: 2, name: 'Lead', period: { start: '2026-01-01', end: '2026-12-31' } };
      expect(service.validatePosition(newPos, positions)).toBeNull();
    });
  });

  describe('validateTask', () => {
    const positions: Position[] = [
      { id: 1, name: 'Dev', employeeId: 1, period: { start: '2025-01-01', end: '2025-12-31' } }
    ];
    const tasks: Task[] = [
      { id: 1, name: 'Task', employeeId: 1, date: '2025-06-01' }
    ];
    it('should return error for duplicate task', () => {
      const newTask: Task = { id: 2, name: 'Task', employeeId: 1, date: '2025-06-01' };
      expect(service.validateTask(newTask, tasks, positions)).toBe('Duplikat oppgave');
    });
    it('should return error if employee has no positions', () => {
      const newTask: Task = { id: 2, name: 'Task2', employeeId: 2, date: '2025-06-01' };
      expect(service.validateTask(newTask, [], positions)).toBe('Denne ansatte har ingen stillinger.');
    });
    it('should return error if task is outside all position periods', () => {
      const newTask: Task = { id: 2, name: 'Task2', employeeId: 1, date: '2026-01-01' };
      expect(service.validateTask(newTask, [], positions)).toBe('Oppgaven må være innenfor en av ansattens stillingsperioder.');
    });
    it('should return null for valid task', () => {
      const newTask: Task = { id: 2, name: 'Task2', employeeId: 1, date: '2025-07-01' };
      expect(service.validateTask(newTask, tasks, positions)).toBeNull();
    });
    it('should handle date format normalization', () => {
      const newTask: Task = { id: 3, name: 'Task3', employeeId: 1, date: '01.06.2025' };
      expect(service.validateTask(newTask, [], positions)).toBeNull();
    });
  });
});
