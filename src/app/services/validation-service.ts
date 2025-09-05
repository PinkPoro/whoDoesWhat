import { Injectable } from '@angular/core';
import { Employee, Position, Task } from '../shared/models/whoDoesWhat';

@Injectable({ providedIn: 'root' })
export class ValidationService {

  validateEmployee(newEmployee: Employee, employees: Employee[]): string | null {
    const duplicate = employees.some(emp =>
      emp.name.trim().toLowerCase() === newEmployee.name.trim().toLowerCase()
    );
    if (duplicate) {
      return 'En ansatt med dette navnet finnes allerede.';
    }
    return null;
  }

  validatePosition(newPosition: Position, positions: Position[]): string | null {
    const duplicate = positions.some(pos =>
      pos.name.trim().toLowerCase() === newPosition.name.trim().toLowerCase() &&
      pos.employeeId === newPosition.employeeId &&
      pos.id !== newPosition.id
    );
    if (duplicate) {
      return 'Duplikat stilling: samme navn og ansatt-id finnes allerede.';
    }

    const newStart = new Date(newPosition.period.start);
    const newEnd = new Date(newPosition.period.end);
    const overlap = positions.some(pos =>
      pos.employeeId === newPosition.employeeId &&
      pos.id !== newPosition.id &&
      newStart <= new Date(pos.period.end) &&
      newEnd >= new Date(pos.period.start)
    );
    if (overlap) {
      return 'Overlappende periode for denne ansatt-id.';
    }

    return null;
  }

  validateTask(newTask: Task, tasks: Task[], positions: Position[]): string | null {
    const newDate = this.normalizeDate(newTask.date);

    const duplicate = tasks.some(t =>
      t.name.trim().toLowerCase() === newTask.name.trim().toLowerCase() &&
      t.employeeId === newTask.employeeId &&
      this.normalizeDate(t.date) === newDate
    );
    if (duplicate) {
      return 'Duplikat oppgave';
    }

    const employeePositions = positions.filter(pos => pos.employeeId == newTask.employeeId);
    if (employeePositions.length === 0) {
      return 'Denne ansatte har ingen stillinger.';
    }

    const taskDate = new Date(newDate);
    const isWithinPeriod = employeePositions.some(pos => {
      const start = new Date(pos.period.start);
      const end = new Date(pos.period.end);
      return taskDate >= start && taskDate <= end;
    });
    if (!isWithinPeriod) {
      return 'Oppgaven må være innenfor en av ansattens stillingsperioder.';
    }

    return null;
  }

  normalizeDate(date: string): string {
    // Accepts 'YYYY-MM-DD' or 'DD.MM.YYYY' and returns 'YYYY-MM-DD'
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
    const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(date);
    if (match) return `${match[3]}-${match[2]}-${match[1]}`;
    return date;
  }

  normalizePeriod(period: { start: string; end: string }): { start: string; end: string } {
    return {
      start: this.normalizeDate(period.start),
      end: this.normalizeDate(period.end)
    };
  }
}
