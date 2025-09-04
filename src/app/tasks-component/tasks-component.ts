import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Employee, Position, Task } from '../models/whoDoesWhat';
import { Store } from '@ngrx/store';
import { TasksActions } from '../store/tasks/tasks.actions';
import { selectAllTasks } from '../store/tasks/tasks.selectors';
import { TaskDialogComponent } from './task-dialog.component';

// Angular material

import { MaterialModule } from '../shared/modules/material/material-module';
import { MatTableDataSource,  } from '@angular/material/table';
import { MatSort,  } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { selectAllEmployees } from '../store/employees/employees.selectors';
import { selectAllPositions } from '../store/positions/positions.selectors';
import { ValidationService } from '../services/validation-service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  selector: 'app-tasks-component',
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
  ],
  templateUrl: './tasks-component.html',
  styleUrls: ['./tasks-component.scss']
})
export class TasksComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;

  private store = inject(Store);
  private dialog = inject(MatDialog);
  private validator = inject(ValidationService);
  private snack = inject(MatSnackBar);

  displayedColumns: string[] = ['id', 'name', 'employeeId', 'date', 'actions'];
  dataSource = new MatTableDataSource<Task>([]);

  private tasksAll: Task[] = [];
  private employees: Employee[] = [];
  private positions: Position[] = [];

  searchTerm = '';

  constructor() {
    this.store.dispatch(TasksActions.load());

    this.store.select(selectAllTasks).subscribe(rows => {
      this.tasksAll = rows;
      this.dataSource.data = rows;
    });
    this.store.select(selectAllEmployees).subscribe(v => (this.employees = v));
    this.store.select(selectAllPositions).subscribe(v => (this.positions = v));

    this.dataSource.filterPredicate = (data, filter) => {
      const f = filter.trim().toLowerCase();
      return (
        data.name.toLowerCase().includes(f) ||
        String(data.employeeId).includes(f) ||
        data.date.includes(f)
      );
    };
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  newTask() {
    this.openDialog(null);
  }

  editTask(row: Task) {
    this.openDialog(row);
  }

  private openDialog(existing: Task | null) {
    const ref = this.dialog.open(TaskDialogComponent, {
      width: '480px',
      data: existing,
    });

    ref.afterClosed().subscribe((result: Task | null) => {
      if (!result) return;

      const draft = [...this.tasksAll];
      if (result.id) {
        const i = draft.findIndex(t => t.id === result.id);
        if (i >= 0) draft[i] = { ...result };
      } else {
        draft.push({ ...result, id: undefined });
      }

      try {
        this.validator.validate(this.employees, this.positions, draft);
      } catch (e: any) {
        this.snack.open(e?.message ?? 'Ugyldig oppgave', 'Lukk', { duration: 5000 });
        return;
      }

      this.store.dispatch(TasksActions.save({ task: result }));
    });
  }

  form: Task = {
    name: '',
    employeeId: 0,
    date: '',
  };

  edit(t: Task) {
    this.form = { ...t };
  }

  reset() {
    this.form = { name: '', employeeId: 0, date: '' };
  }

  save() {
    this.store.dispatch(TasksActions.save({ task: this.form }));
    this.reset();
  }

 remove(id: number | undefined) {
    if (id == null) {
      this.snack.open('Kan ikke slette: Oppgaven mangler ID', 'Lukk', { duration: 4000 });
      return;
    }

    const draft = this.tasksAll.filter(t => t.id !== id);

    try {
      this.validator.validate(this.employees, this.positions, draft);
    } catch (e: any) {
      this.snack.open(e?.message ?? 'Kan ikke slette oppgaven pga. validering', 'Lukk', { duration: 5000 });
      return;
    }

    this.store.dispatch(TasksActions.delete({ id }));
  }

  applyFilterFromString(v: string) {
    this.searchTerm = v ?? '';
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
    this.dataSource.paginator?.firstPage();
  }

  clearFilter() {
    this.applyFilterFromString('');
  }
}
