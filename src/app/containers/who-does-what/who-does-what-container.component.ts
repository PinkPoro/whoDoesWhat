import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit, Signal } from '@angular/core';
import { Store } from '@ngrx/store';

import { ValidationService } from '../../services/validation-service';

import { MatSnackBar } from '@angular/material/snack-bar';

import { PositionsContainerComponent } from '../positions-container/positions-container.component';
import { EmployeeContainerComponent } from '../employee-container/employee-container';
import { TaskContainerComponent } from '../task-container/task-container';
import { AssignmentsComponent } from '../../components/assignments-component/assignments-component';

import { selectAllEmployees } from '../../store/employees/employees.selectors';
import { selectAllTasks } from '../../store/tasks/tasks.selectors';
import { selectAllPositions } from '../../store/positions/positions.selectors';
import { EmployeesActions } from '../../store/employees/employees.actions';
import { PositionsActions } from '../../store/positions/positions.actions';
import { TasksActions } from '../../store/tasks/tasks.actions';

import { Assignment, Employee, Position, Task } from '../../shared/models/whoDoesWhat';


@Component({
  standalone: true,
  selector: 'app-who-does-what-container-component',
  imports: [
    CommonModule,
    PositionsContainerComponent,
    EmployeeContainerComponent,
    TaskContainerComponent,
    AssignmentsComponent
  ],
  templateUrl: './who-does-what-container.component.html',
  styleUrls: ['./who-does-what-container.component.scss']
})
export class WhoDoesWhatContainerComponent implements OnInit{
  private store = inject(Store);
  private snackBar = inject(MatSnackBar);
  private validationService = inject(ValidationService);

  employees: Employee[] = [];
  positions: Position[] = [];
  tasks: Task[] = [];
  assignments: Assignment[] = [];

  getEmployees: Signal<Employee[]> = this.store.selectSignal(selectAllEmployees);
  getTasks: Signal<Task[]> = this.store.selectSignal(selectAllTasks);
  getPositions: Signal<Position[]> = this.store.selectSignal(selectAllPositions);

  constructor(){
    effect(() => {
      this.employees = this.getEmployees();
      this.tasks = this.getTasks();
      this.positions = this.getPositions();

      this.assignments = this.employees.map(emp => {
        const positions = this.getPositionsForEmployee(emp.id);
        return {
          employee: emp,
          positions: positions.map(pos => ({
            position: pos,
            tasks: this.getTasksForEmployee(emp.id).filter(task => {
              const taskDate = new Date(task.date);
              const start = new Date(pos.period.start);
              const end = new Date(pos.period.end);
              return taskDate >= start && taskDate <= end;
            })
          }))
        };
      }).filter(assignment => assignment.positions.length > 0);
    });
  }

  onCreateEmployee(employee: Employee) {
    const error = this.validationService.validateEmployee(employee, this.employees);
    if (error) {
      this.snackBar.open(error, 'Lukk', { duration: 4000 });
      return;
    }
    this.store.dispatch(EmployeesActions.create({ employee: employee }));
  }

  onCreatePosition(position: Position) {
    const error = this.validationService.validatePosition(position, this.positions);
    if (error) {
      this.snackBar.open(error, 'Lukk', { duration: 4000 });
      return;
    }
    const normalizedPosition = {
      ...position,
      period: this.validationService.normalizePeriod(position.period)
    };
    this.store.dispatch(PositionsActions.create({ position: normalizedPosition }));
  }

  onSavePosition(form: Position) {
    const error = this.validationService.validatePosition(form, this.positions);
    if (error) {
      this.snackBar.open(error, 'Lukk', { duration: 4000 });
      return;
    }
    const normalizedPosition = {
      ...form,
      period: this.validationService.normalizePeriod(form.period)
    };
    this.store.dispatch(PositionsActions.save({ position: normalizedPosition }));
  }

  onRemovePosition(id: number) {
    this.store.dispatch(PositionsActions.delete({ id }));
  }

  onCreateTask(task: Task) {
    const error = this.validationService.validateTask(task, this.tasks, this.positions);
    if (error) {
      this.snackBar.open(error, 'Lukk', { duration: 4000 });
      return;
    }
    const normalizedTask = {
      ...task,
      date: this.validationService.normalizeDate(task.date)
    };
    this.store.dispatch(TasksActions.create({ task: normalizedTask }));
  }

  onSaveTask(task: Task) {
    const error = this.validationService.validateTask(task, this.tasks, this.positions);
    if (error) {
      this.snackBar.open(error, 'Lukk', { duration: 4000 });
      return;
    }
    const normalizedTask = {
      ...task,
      date: this.validationService.normalizeDate(task.date)
    };
    this.store.dispatch(TasksActions.save({ task: normalizedTask }));
  }

  onRemoveTask(id: number) {
    this.store.dispatch(TasksActions.delete({ id }));
  }



  getPositionsForEmployee(employeeId: number): Position[] {
    return this.positions.filter(position => position.employeeId == employeeId);
  }

  getTasksForEmployee(employeeId: number): Task[] {
    return this.tasks.filter(task => task.employeeId == employeeId);
  }

  ngOnInit(): void {
    this.store.dispatch(EmployeesActions.load());
    this.store.dispatch(PositionsActions.load());
    this.store.dispatch(TasksActions.load());
  }
}
