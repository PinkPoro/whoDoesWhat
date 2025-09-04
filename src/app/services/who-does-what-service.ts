import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee, Position, Task } from '../models/whoDoesWhat';

@Injectable({ providedIn: 'root' })
export class WhoDoesWhatService {
  private http = inject(HttpClient);
  private base = 'http://localhost:3000';

  // --- reads ---
  employees(): Observable<Employee[]> { return this.http.get<Employee[]>(`${this.base}/employees`); }
  positions():  Observable<Position[]> { return this.http.get<Position[]>(`${this.base}/positions`); }
  tasks():      Observable<Task[]>     { return this.http.get<Task[]>(`${this.base}/tasks`); }
  employeeById(id: number) { return this.http.get<Employee>(`${this.base}/employees/${id}`); }
  positionById(id: number) { return this.http.get<Position>(`${this.base}/positions/${id}`); }
  taskById(id: number)     { return this.http.get<Task>(`${this.base}/tasks/${id}`); }
  positionsByEmployee(employeeId: number) {
    return this.http.get<Position[]>(`${this.base}/positions?employeeId=${employeeId}`);
  }
  tasksByEmployee(employeeId: number) {
    return this.http.get<Task[]>(`${this.base}/tasks?employeeId=${employeeId}`);
  }

  // --- creates ---
  createEmployee(e: Omit<Employee, 'id'>) { return this.http.post<Employee>(`${this.base}/employees`, e); }
  createPosition(p: Omit<Position, 'id'>) { return this.http.post<Position>(`${this.base}/positions`, p); }
  createTask(t: Omit<Task, 'id'>)         { return this.http.post<Task>(`${this.base}/tasks`, t); }

  // --- updates ---
  updateEmployee(e: Employee) { return this.http.put<Employee>(`${this.base}/employees/${e.id}`, e); }
  updatePosition(p: Position) { return this.http.put<Position>(`${this.base}/positions/${p.id}`, p); }
  updateTask(t: Task)         { return this.http.put<Task>(`${this.base}/tasks/${t.id}`, t); }

  // --- deletes ---
  deleteEmployee(id: number) { return this.http.delete<void>(`${this.base}/employees/${id}`); }
  deletePosition(id: number) { return this.http.delete<void>(`${this.base}/positions/${id}`); }
  deleteTask(id: number)     { return this.http.delete<void>(`${this.base}/tasks/${id}`); }
}
