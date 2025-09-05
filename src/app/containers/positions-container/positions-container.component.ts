import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';

import { PositionsActions } from '../../store/positions/positions.actions';

import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CreatePositionDialogComponent } from '../../components/positions-component/create-position-dialog/create-position-dialog';
import { UpdatePositionsFormComponent } from '../../components/positions-component/update-position-form/update-position-form';
import { PositionsTableComponent } from '../../components/positions-component/positions-table/positions-table';
import { Position } from '../../shared/models/whoDoesWhat';

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
export class PositionsContainerComponent implements OnDestroy, OnChanges {
  @Input() positions: Position[] = [];

  private store = inject(Store);
  private createDialog = inject(MatDialog);
  private subscriptions: Subscription = new Subscription();
  private snackBar = inject(MatSnackBar);

  searchTerm = '';
  filteredPositions: Position[] = [];
  form: Position = { id: 0, name: '', employeeId: 0, period: { start: '', end: '' } };
  showEditForm = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['positions']) {
      this.applyFilter();
    }
  }

  openCreateDialog() {
    const ref = this.createDialog.open(CreatePositionDialogComponent, { width: '400px' });
    this.subscriptions.add(ref.afterClosed().subscribe(result => {
      if (result) {
        const id = autoId(result.id, this.positions);
        const payload = { ...result, id: id };
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
    this.subscriptions.unsubscribe();
  }
}

function autoId(id: number, position: Position[]): string {
  if (id == 0) {
    const maxId = position.map(p => p.id ?? 0).reduce((max, curr) => curr > max ? curr : max, 0);
    id = (Number(maxId) + 1);
  }
  return id.toString();
}
