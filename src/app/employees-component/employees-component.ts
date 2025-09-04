import { Component, AfterViewInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';

import { Employee, Position, Task } from '../models/whoDoesWhat';
import { selectAllEmployees } from '../store/employees/employees.selectors';
import { EmployeesActions } from '../store/employees/employees.actions';

import { MaterialModule } from '../shared/modules/material/material-module';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ValidationService } from '../services/validation-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { selectAllTasks } from '../store/tasks/tasks.selectors';
import { selectAllPositions } from '../store/positions/positions.selectors';
import { EmployeeDialogComponent } from './employees-dialog.component/employees-dialog.component';


@Component({
  standalone: true,
  selector: 'app-employees-component',
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  templateUrl: './employees-component.html',
  styleUrls: ['./employees-component.scss'],
})
export class EmployeesComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;

  private store = inject(Store);
  private dialog = inject(MatDialog);
  private validator = inject(ValidationService);
  private snack = inject(MatSnackBar);

  private employees: Employee[] = [];
  private positions: Position[] = [];
  private tasks: Task[] = [];

  displayedColumns: string[] = ['id', 'name', 'actions'];
  dataSource = new MatTableDataSource<Employee>([]);

  searchTerm = '';

  form: Employee = { id: 0, name: '' };

  constructor() {
    this.store.dispatch(EmployeesActions.load());
    this.store.select(selectAllEmployees).subscribe(rows => {
      this.dataSource.data = rows;
    });
    this.dataSource.filterPredicate = (data, filter) =>
      `${data.id} ${data.name}`.toLowerCase().includes(filter.trim().toLowerCase());

    this.store.select(selectAllTasks).subscribe(t => this.tasks = t);
    this.store.select(selectAllPositions).subscribe(t => this.positions = t);

    this.dataSource.filterPredicate = (data, filter) =>
    `${data.name}`.toLowerCase().includes(filter.trim().toLowerCase());
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  newEmployee() { this.openDialog(null); }

  editEmployee(row: Employee) {
    this.openDialog(row);
  }

  private openDialog(existing: Employee | null) {
    const ref = this.dialog.open(EmployeeDialogComponent, {
      width: '420px',
      data: existing,
    });

    ref.afterClosed().subscribe((result: Employee | null) => {
      if (!result) return;

      const draft = [...this.employees];
      if (result.id) {
        const i = draft.findIndex(e => e.id === result.id);
        if (i >= 0) draft[i] = { ...result };
      } else {
        draft.push({ ...result, id: result.id ?? undefined });
      }

      try {
        this.validator.validate(draft, this.positions, this.tasks);
      } catch (e: any) {
        this.snack.open(e?.message ?? 'Ugyldig ansatt', 'Lukk', { duration: 5000 });
        return;
      }

      this.store.dispatch(EmployeesActions.save({ employee: result }));
    });
  }

  applyFilterFromString(v: string) {
    this.searchTerm = v ?? '';
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }

  clearFilter() {
    this.applyFilterFromString('');
  }

  edit(emp: Employee): void {
    this.form = { ...emp };
  }
  reset() { this.form = { id: 0, name: '' }; }
  save() {
    const payload = this.form.id ? this.form : ({ name: this.form.name } as Employee);
    this.store.dispatch(EmployeesActions.save({ employee: payload }));
    this.reset();
  }
  remove(id: number)  { this.store.dispatch(EmployeesActions.delete({ id })); }

}
