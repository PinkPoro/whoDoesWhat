import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';

import { CreatePositionDialogComponent } from '../../components/positions-component/create-position-dialog/create-position-dialog';
import { UpdatePositionsFormComponent } from '../../components/positions-component/update-position-form/update-position-form';
import { PositionsTableComponent } from '../../components/positions-component/positions-table/positions-table';
import { Position } from '../../shared/models/whoDoesWhat';
import { PositionsActions } from '../../store/positions/positions.actions';
import { selectAllPositions } from '../../store/positions/positions.selectors';

import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  selector: 'app-positions-container-component',
  imports: [
    CommonModule,
    FormsModule,
    PositionsTableComponent,
    UpdatePositionsFormComponent,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './positions-container.component.html',
  styleUrl: './positions-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PositionsContainerComponent implements OnDestroy {
  private store = inject(Store);
  private createDialog = inject(MatDialog);
  private destroy$ = new Subject<void>();
  private subscriptions: Subscription = new Subscription();
  private snackBar = inject(MatSnackBar);

  positions: Position[] = [];
  searchTerm = '';
  filteredPositions: Position[] = [];
  form: Position = { id: 0, name: '', employeeId: 0, period: { start: '', end: '' } };
  showEditForm = false;

  constructor() {
    this.store.dispatch(PositionsActions.load());
    this.subscriptions.add(this.store.select(selectAllPositions)
      .pipe(takeUntil(this.destroy$))
      .subscribe(rows => {this.positions = rows; this.applyFilter();}));
  }

  openCreateDialog() {
    const ref = this.createDialog.open(CreatePositionDialogComponent, { width: '400px' });
    this.subscriptions.add(ref.afterClosed().subscribe(result => {
      if (result) {
        let id = result.id;
        if (id == 0) {
          const maxId = this.positions.map(p => p.id ?? 0).reduce((max, curr) => curr > max ? curr : max, 0);
          id = (Number(maxId) + 1);
        }
        const payload = { ...result, id: id.toString() };
        this.onCreate(payload);
      }
    }));
  }

  onCreate(form: Position) {
    const error = this.validatePosition(form);
    if (error) {
      this.snackBar.open(error, 'Lukk', { duration: 4000 });
      return;
    }
    this.store.dispatch(PositionsActions.create({ position: form }));
    this.onReset()
  }

  onEdit(position: Position) {
    this.showEditForm = true;
    this.form = { ...position };
  }

  onRemove(id: number) {
    this.store.dispatch(PositionsActions.delete({ id }));
  }

  onSave(form: Position) {
    const error = this.validatePosition(form);
    if (error) {
      this.snackBar.open(error, 'Lukk', { duration: 4000 });
      return;
    }
    this.store.dispatch(PositionsActions.save({ position: form }));
    this.onReset();
    this.showEditForm = false;
  }

  onCancel() {
    this.showEditForm = false;
    this.onReset();
  }

  onReset() {
    this.form = { id: 0, name: '', employeeId: 0, period: { start: '', end: '' } };
  }

  onSearch(term: string) {
    this.searchTerm = term;
    this.applyFilter();
  }

  applyFilter() {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredPositions = this.positions.filter(pos =>
      pos.name.toLowerCase().includes(term) ||
      (pos.id !== undefined && String(pos.id).includes(term))
    );
  }

  validatePosition(newPosition: Position): string | null {

    const duplicate = this.positions.some(pos =>
      pos.name.trim().toLowerCase() === newPosition.name.trim().toLowerCase() &&
      pos.employeeId === newPosition.employeeId &&
      pos.id !== newPosition.id
    );
    if (duplicate) {
      return 'Duplikat stilling: samme navn og ansatt-id finnes allerede.';
    }

    const newStart = new Date(newPosition.period.start);
    const newEnd = new Date(newPosition.period.end);
    const overlap = this.positions.some(pos =>
      pos.employeeId === newPosition.employeeId &&
      pos.id !== newPosition.id &&
      newStart <= new Date(pos.period.end) &&
      newEnd >= new Date(pos.period.start)
    );
    if (overlap) {
      return 'Overlappende periode for denne ansatt-id.';
    }

    return null;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();

    this.subscriptions.unsubscribe();
  }
}
