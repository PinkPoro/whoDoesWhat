import { Employee, Position, Task } from "../models/whoDoesWhat";
import { ValidationService } from "./validation-service";


describe('ValidatorService', () => {
  const svc = new ValidationService();

  const emp: Employee = { id: 1, name: 'Test' };
  const pos: Position = { id: 1, name: 'Dev', employeeId: 1,
    period: { start: '2025-01-01', end: '2025-12-31' } };
  const task: Task = { id: 1, name: 'Oppg', employeeId: 1, date: '2025-06-01' };

  it('enkelt tilfelle matcher', () => {
    expect(() => svc.validate([emp], [pos], [task])).not.toThrow();
    const a = svc.assign([task], [pos])[0];
    expect(a.positionId).toBe(1);
  });

  it('grenser: dato == start og dato == slutt', () => {
    const t1: Task = { ...task, id: 2, date: '2025-01-01' };
    const t2: Task = { ...task, id: 3, date: '2025-12-31' };
    svc.validate([emp], [pos], [t1, t2]);
    const asg = svc.assign([t1, t2], [pos]);
    expect(asg[0].positionId).toBe(1);
    expect(asg[1].positionId).toBe(1);
  });

  it('oppgave utenfor periode ignoreres (positionId undefined)', () => {
    const t: Task = { ...task, id: 4, date: '2026-01-01' };
    svc.validate([emp], [pos], [t]);
    const a = svc.assign([t], [pos])[0];
    expect(a.positionId).toBeUndefined();
  });

  it('oppgave går til riktig stilling når flere ikke overlapper', () => {
    const p1: Position = { id: 11, name: 'Dev', employeeId: 1,
      period: { start: '2025-01-01', end: '2025-06-30' }};
    const p2: Position = { id: 12, name: 'Ark', employeeId: 1,
      period: { start: '2025-07-01', end: '2025-12-31' }};
    const t1: Task = { id: 21, name: 'A', employeeId: 1, date: '2025-02-01' };
    const t2: Task = { id: 22, name: 'B', employeeId: 1, date: '2025-08-01' };

    svc.validate([emp], [p1, p2], [t1, t2]);
    const asg = svc.assign([t1, t2], [p1, p2]);
    expect(asg.find(a => a.taskId === 21)!.positionId).toBe(11);
    expect(asg.find(a => a.taskId === 22)!.positionId).toBe(12);
  });

  it('kaster på overlappende stillinger', () => {
    const p1: Position = { id: 31, name: 'A', employeeId: 1,
      period: { start: '2025-01-01', end: '2025-06-30' }};
    const p2: Position = { id: 32, name: 'B', employeeId: 1,
      period: { start: '2025-06-01', end: '2025-12-31' }};
    expect(() => svc.validate([emp], [p1, p2], [task])).toThrow();
  });

  it('kaster på duplikater (ansatte/oppgaver/stillinger)', () => {
    const e2 = { ...emp };
    const t2 = { ...task };
    const p2 = { ...pos };
    expect(() => svc.validate([emp, e2], [pos], [task])).toThrow();
    expect(() => svc.validate([emp], [pos, p2], [task])).toThrow();
    expect(() => svc.validate([emp], [pos], [task, t2])).toThrow();
  });
});
