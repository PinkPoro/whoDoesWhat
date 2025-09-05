import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

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

  @Output() create = new EventEmitter<Position>();
  @Output() save = new EventEmitter<Position>();
  @Output() remove = new EventEmitter<number>();

  private createDialog = inject(MatDialog);
  private subscriptions: Subscription = new Subscription();

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
        this.create.emit(payload);
      }
    }));
  }

  onEdit(position: Position) {
    this.showEditForm = true;
    this.form = { ...position };
  }

  onRemove(id: number) {
    this.remove.emit(id);
  }

  onSave(form: Position) {
    this.save.emit(form);
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
