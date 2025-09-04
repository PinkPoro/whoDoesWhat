import { Injectable } from '@angular/core';
import { Employee, Position, Task, Assignment } from '../shared/models/whoDoesWhat';

@Injectable({ providedIn: 'root' })
export class ValidationService {

  validate(employees: Employee[], positions: Position[], tasks: Task[]): void {
    this.ensureUniqueIds(employees.map(e => e.id), 'Employees');
    this.ensureUniqueIds(positions.map(p => p.id!).filter(Boolean), 'Positions');
    this.ensureUniqueIds(tasks.map(t => t.id!).filter(Boolean), 'Tasks');

    const employeesById = new Map(employees.map(e => [e.id, e]));

    for (const p of positions) {
      if (!employeesById.has(p.employeeId)) {
        throw new Error(`Position ${p.id ?? '(ny)'} peker til ukjent employeeId=${p.employeeId}`);
      }
      if (!this.isValidDateRange(p.period.start, p.period.end)) {
        throw new Error(`Position ${p.id ?? '(ny)'} har ugyldig periode: ${p.period.start} → ${p.period.end}`);
      }
    }

    this.assertNoOverlapsForSameTitle(positions);

    for (const t of tasks) {
      const emp = employeesById.get(t.employeeId);
      if (!emp) throw new Error(`Task ${t.id ?? '(ny)'} peker til ukjent employeeId=${t.employeeId}`);
      if (!this.isIsoDate(t.date)) throw new Error(`Task ${t.id ?? '(ny)'} har ugyldig dato: ${t.date}`);

      const hasPosition = positions.some(
        p => p.employeeId === t.employeeId && this.dateInRange(t.date, p.period.start, p.period.end)
      );
      if (!hasPosition) {
        throw new Error(
          `Task ${t.id ?? '(ny)'} (${t.name}) @ ${t.date} har ingen gyldig stilling for employeeId=${t.employeeId}`
        );
      }
    }
  }

  buildAssignments(employees: Employee[], positions: Position[], tasks: Task[]): Assignment[] {
    return tasks.map(task => {
      const employee = employees.find(e => e.id === task.employeeId) ?? null;
      const position = positions.find(
        p =>
          p.employeeId === task.employeeId &&
          this.dateInRange(task.date, p.period.start, p.period.end)
      ) ?? null;
      return { task, employee, position };
    });
  }

  private ensureUniqueIds(ids: (number|undefined)[], label: string) {
      const seen = new Set<number>();
      for (const id of ids) {
        if (id == null) continue;
        if (seen.has(id)) throw new Error(`${label}: duplisert id=${id}`);
        seen.add(id);
      }
    }

    private isIsoDate(s: string): boolean {
      // enkel sjekk: YYYY-MM-DD
      return /^\d{4}-\d{2}-\d{2}$/.test(s);
    }

    private isValidDateRange(start: string, end: string): boolean {
      if (!this.isIsoDate(start) || !this.isIsoDate(end)) return false;
      return start <= end;
    }

    private dateInRange(d: string, start: string, end: string): boolean {
      return d >= start && d <= end;
    }

    private assertNoOverlapsForSameTitle(positions: Position[]) {
      // grupper per employeeId + title (name)
      const groups = new Map<string, Position[]>();
      for (const p of positions) {
        const key = `${p.employeeId}::${p.name.toLowerCase()}`;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(p);
      }
      // sortér og sjekk overlapp
      for (const [key, list] of groups) {
        const sorted = [...list].sort((a, b) => a.period.start.localeCompare(b.period.start));
        for (let i = 1; i < sorted.length; i++) {
          const prev = sorted[i - 1];
          const curr = sorted[i];
          if (prev.period.end >= curr.period.start) {
            throw new Error(
              `Overlappende perioder for ${key.replace('::', ' / ')}: ` +
              `[${prev.period.start}→${prev.period.end}] og [${curr.period.start}→${curr.period.end}]`
            );
          }
        }
      }
    }
}
