import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit, Signal } from '@angular/core';
import { Store } from '@ngrx/store';

import { PositionsContainerComponent } from '../positions-container/positions-container.component';
import { EmployeeContainerComponent } from '../employee-container/employee-container';
import { TaskContainerComponent } from '../task-container/task-container';

import { selectAllEmployees } from '../../store/employees/employees.selectors';
import { EmployeesActions } from '../../store/employees/employees.actions';

import { Employee, Position, Task } from '../../shared/models/whoDoesWhat';
import { selectAllTasks } from '../../store/tasks/tasks.selectors';
import { selectAllPositions } from '../../store/positions/positions.selectors';
import { PositionsActions } from '../../store/positions/positions.actions';
import { TasksActions } from '../../store/tasks/tasks.actions';


@Component({
  standalone: true,
  selector: 'app-who-does-what-container-component',
  imports: [
    CommonModule,
    PositionsContainerComponent,
    EmployeeContainerComponent,
    TaskContainerComponent
  ],
  templateUrl: './who-does-what-container.component.html',
  styleUrls: ['./who-does-what-container.component.scss']
})
export class WhoDoesWhatContainerComponent implements OnInit{
  private store = inject(Store);

  employees: Employee[] = [];
  positions: Position[] = [];
  tasks: Task[] = [];

  getEmployees: Signal<Employee[]> = this.store.selectSignal(selectAllEmployees);
  getTasks: Signal<Task[]> = this.store.selectSignal(selectAllTasks);
  getPositions: Signal<Position[]> = this.store.selectSignal(selectAllPositions);

  constructor(){
    effect(() => {
      this.employees = this.getEmployees();
      this.tasks = this.getTasks();
      this.positions = this.getPositions();
    });
  }

  ngOnInit(): void {
    this.store.dispatch(EmployeesActions.load());
    this.store.dispatch(PositionsActions.load());
    this.store.dispatch(TasksActions.load());
  }
}
