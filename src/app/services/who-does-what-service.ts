import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee, Position, Task } from '../shared/models/whoDoesWhat';

@Injectable({ providedIn: 'root' })
export class WhoDoesWhatService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000';

  employees(): Observable<Employee[]> { return this.http.get<Employee[]>(`${this.baseUrl}/employees`); }
  getPositions():  Observable<Position[]> { return this.http.get<Position[]>(`${this.baseUrl}/positions`); }
  tasks():      Observable<Task[]>     { return this.http.get<Task[]>(`${this.baseUrl}/tasks`); }
  employeeById(id: number) { return this.http.get<Employee>(`${this.baseUrl}/employees/${id}`); }
  positionById(id: number) { return this.http.get<Position>(`${this.baseUrl}/positions/${id}`); }
  taskById(id: number)     { return this.http.get<Task>(`${this.baseUrl}/tasks/${id}`); }
  positionsByEmployee(employeeId: number) {
    return this.http.get<Position[]>(`${this.baseUrl}/positions?employeeId=${employeeId}`);
  }
  tasksByEmployee(employeeId: number) {
    return this.http.get<Task[]>(`${this.baseUrl}/tasks?employeeId=${employeeId}`);
  }

  createEmployee(e: Employee) {
    return this.http.post<Employee>(`${this.baseUrl}/employees`, e);
  }
  createPosition(p: Position) {
    return this.http.post<Position>(`${this.baseUrl}/positions`, p);
  }
  createTask(t: Omit<Task, 'id'>)         { return this.http.post<Task>(`${this.baseUrl}/tasks`, t); }

  updatePosition(p: Position) { return this.http.put<Position>(`${this.baseUrl}/positions/${p.id}`, p); }
  updateTask(t: Task)         { return this.http.put<Task>(`${this.baseUrl}/tasks/${t.id}`, t); }
  deletePosition(id: number) { return this.http.delete<void>(`${this.baseUrl}/positions/${id}`); }
  deleteTask(id: number)     { return this.http.delete<void>(`${this.baseUrl}/tasks/${id}`); }
}
