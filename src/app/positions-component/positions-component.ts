import { Component, AfterViewInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';

import { Employee, Position, Task } from '../models/whoDoesWhat';
import { selectAllPositions } from '../store/positions/positions.selectors';
import { PositionsActions } from '../store/positions/positions.actions';

import { MaterialModule } from '../shared/modules/material/material-module';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ValidationService } from '../services/validation-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { selectAllEmployees } from '../store/employees/employees.selectors';
import { selectAllTasks } from '../store/tasks/tasks.selectors';
import { PositionDialogComponent } from './position-dialog.component/position-dialog.component';


@Component({
  standalone: true,
  selector: 'app-positions-component',
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  templateUrl: './positions-component.html',
  styleUrls: ['./positions-component.scss'],
})
export class PositionsComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;

  private store = inject(Store);
  private dialog = inject(MatDialog);
  private validator = inject(ValidationService);
  private snack = inject(MatSnackBar);

  private employees: Employee[] = [];
  private allPositions: Position[] = [];
  private tasks: Task[] = [];

  displayedColumns: string[] = ['id','name', 'employeeId', 'start', 'end', 'actions'];
  dataSource = new MatTableDataSource<Position>([]);

  searchTerm = '';

  form: Position = { id: 0, name: '', employeeId: 0, period: { start: '', end: '' } };

  constructor() {
    this.store.dispatch(PositionsActions.load());
    this.store.select(selectAllPositions).subscribe(rows => {
      this.dataSource.data = rows;
    });

    this.store.select(selectAllEmployees).subscribe(e => this.employees = e);
    this.store.select(selectAllTasks).subscribe(t => this.tasks = t);

    // Filtrering (navn, employeeId og periode)
    this.dataSource.filterPredicate = (data, filter) => {
      const search = filter.trim().toLowerCase();
      return (
        data.name.toLowerCase().includes(search) ||
        `${data.employeeId}`.includes(search) ||
        data.period.start.includes(search) ||
        data.period.end.includes(search)
      );
    };

    this.dataSource.sortingDataAccessor = (item, prop) =>
    prop === 'start' ? item.period.start :
    prop === 'end'   ? item.period.end   :
    (item as any)[prop];

  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;

    // Sort på nested period-felt
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'start': return item.period.start;
        case 'end': return item.period.end;
        default: return (item as any)[property];
      }
    };
  }

  newPosition() {
    this.openDialog(null);
  }
  editPosition(row: Position) {
    this.openDialog(row);
  }

  private openDialog(existing: Position | null) {
    const ref = this.dialog.open(PositionDialogComponent, {
      width: '480px',
      data: existing,
    });

    ref.afterClosed().subscribe((result: Position | null) => {
      if (!result) return;

      const draft = [...this.allPositions];
      if (result.id) {
        const i = draft.findIndex(p => p.id === result.id);
        if (i >= 0) draft[i] = { ...result };
      } else {
        draft.push({ ...result, id: undefined });
      }

      try {
        this.validator.validate(this.employees, draft, this.tasks);
      } catch (e: any) {
        this.snack.open(e?.message ?? 'Ugyldig stilling', 'Lukk', { duration: 5000 });
        return;
      }

      this.store.dispatch(PositionsActions.save({ position: result }));
    });
  }

  applyFilterFromString(v: string) {
    this.searchTerm = v ?? '';
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }

  clearFilter() {
    this.applyFilterFromString('');
  }

  edit(p: Position) {
    this.form = { ...p };
  }

  reset() {
    this.form = { name: '', employeeId: 0, period: { start: '', end: '' } };
  }

  save() {
    const payload = this.form.id
      ? this.form
      : { ...this.form, id: undefined };

    this.store.dispatch(PositionsActions.save({ position: payload }));
    this.reset();
  }

  remove(id: number) {
    this.store.dispatch(PositionsActions.delete({ id }));
  }
}
