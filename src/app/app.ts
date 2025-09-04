import { Component, inject, signal, computed, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { forkJoin } from 'rxjs';

import { TasksComponent } from './components/tasks-component/tasks-component';

import { WhoDoesWhatService } from './services/who-does-what-service';
import { ValidationService } from './services/validation-service';
import { Employee, Position, Task } from './shared/models/whoDoesWhat';

import { selectAllEmployees } from './store/employees/employees.selectors';
import { selectAllPositions } from './store/positions/positions.selectors';
import { selectAllTasks } from './store/tasks/tasks.selectors';

import { MaterialModule } from './shared/modules/material/material-module';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { WhoDoesWhatContainerComponent } from './containers/who-does-what/who-does-what-container.component';


type AssignmentRow = { task: string; date: string; employee: string; position: string };

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    WhoDoesWhatContainerComponent

  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class AppComponent implements AfterViewInit {
  private data = inject(WhoDoesWhatService);
  private validator = inject(ValidationService);
  private store = inject(Store);

  employees = signal<Employee[]>([]);
  positions = signal<Position[]>([]);
  tasks = signal<Task[]>([]);
  error = signal<string | null>(null);

  displayedAssignColumns: string[] = ['task', 'employee', 'position', 'date'];
  dataSource = new MatTableDataSource<AssignmentRow>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  assignmentSearch = signal('');

  constructor() {
    this.refreshALL();

    this.store.select(selectAllEmployees).subscribe(e => this.employees.set(e));
    this.store.select(selectAllPositions).subscribe(p => this.positions.set(p));
    this.store.select(selectAllTasks).subscribe(t => this.tasks.set(t));

    this.rebuildAssignments();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyAssignFilter(v: string) {
    this.assignmentSearch.set(v);
    this.dataSource.filter = v.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  refreshALL() {
    forkJoin({
      employees: this.data.employees(),
      positions: this.data.getPositions(),
      tasks: this.data.tasks(),
    }).subscribe(({ employees, positions, tasks }) => {
      this.employees.set(employees);
      this.positions.set(positions);
      this.tasks.set(tasks);
      this.error.set(null);
      this.rebuildAssignments();
    });
  }

  validate() {
    this.error.set(null);
    try {
      this.validator.validate(this.employees(), this.positions(), this.tasks());
    } catch (e: any) {
      this.error.set(e?.message ?? 'Ukjent feil');
    }
  }

  private rebuildAssignments() {
    const emps = this.employees();
    const poss = this.positions();
    const tasks = this.tasks();

    const rows: AssignmentRow[] = tasks.map(task => {
      const emp = emps.find(e => e.id === task.employeeId);
      const pos = poss.find(
        p =>
          p.employeeId === task.employeeId &&
          p.period.start <= task.date &&
          p.period.end >= task.date
      );
      return {
        task: task.name,
        date: task.date,
        employee: emp?.name ?? `Ansatt ${task.employeeId}`,
        position: pos?.name ?? 'Ingen (utenfor periode)',
      };
    });

    this.dataSource.data = rows;
    this.dataSource.filterPredicate = (row, filter) =>
      `${row.task} ${row.employee} ${row.position} ${row.date}`.toLowerCase().includes(filter);
    this.dataSource.sortingDataAccessor = (item, prop) => (item as any)[prop] ?? '';
    this.dataSource.filter = this.assignmentSearch().trim().toLowerCase();
  }
}
