import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TasksActions } from '../../store/tasks/tasks.actions';

import { TasksTableComponent } from '../../components/tasks-component/tasks-table/tasks-table';
import { EditTaskComponent } from '../../components/tasks-component/edit-task-component/edit-task-component';
import { CreateTaskDialogComponent } from '../../components/tasks-component/create-task-dialog/create-task-dialog';
import { Task } from '../../shared/models/whoDoesWhat';

@Component({
  standalone: true,
  selector: 'app-task-container-component',
  imports: [
    CommonModule,
    FormsModule,
    TasksTableComponent,
    MatIconModule,
    MatButtonModule,
    EditTaskComponent
  ],
  templateUrl: './task-container.html',
  styleUrls: ['./task-container.scss']
})
export class TaskContainerComponent implements OnDestroy, OnChanges {
  @Input() task: Task[] = [];

  private store = inject(Store);
  private dialog = inject(MatDialog);
  private subscriptions: Subscription = new Subscription();
  private snackBar = inject(MatSnackBar);

  searchTerm = '';
  filteredTasks: Task[] = [];
  form: Task = { id: 0, name: '', employeeId: 0, date: '' };
  showEditForm = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task']) {
      this.applyFilter();
    }
  }

  openCreateDialog() {
    const ref = this.dialog.open(CreateTaskDialogComponent, { width: '400px' });
    this.subscriptions.add(ref.afterClosed().subscribe(result => {
      if (result) {
        const id = autoId(result.id, this.task);
        const payload = { ...result, id: id };
        this.onCreate(payload);
      }
    }));
  }

  onSave(form: Task) {
    const error = this.validateTask(form);
    if (error) {
      this.snackBar.open(error, 'Lukk', { duration: 4000 });
      return;
    }
    this.store.dispatch(TasksActions.save({ task: form }));
    this.onReset();
  }

  onEdit(task: Task) {
    this.form = { ...task };
    this.showEditForm = true;
  }

  onCreate(form: Task) {
    const error = this.validateTask(form);
    if (error) {
      this.snackBar.open(error, 'Lukk', { duration: 4000 });
      return;
    }
    this.store.dispatch(TasksActions.create({ task: form }));
    this.onReset();
  }

  onCancel() {
    this.onReset();
  }

  onReset(){
    this.form = { id: 0, name: '', employeeId: 0, date: '' };
    this.showEditForm = false;
  }

  onRemove(id: number) {
    this.store.dispatch(TasksActions.delete({ id }));
  }

  onSearch(term: string) {
    this.searchTerm = term;
    this.applyFilter();
  }

  applyFilter() {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredTasks = this.task.filter(t =>
      t.name.toLowerCase().includes(term) ||
      (t.id !== undefined && String(t.id).includes(term))
    );
  }

  validateTask(newTask: Task): string | null {
    const newDate = normalizeDate(newTask.date);
    const duplicate = this.task.some(t =>
      t.name.trim().toLowerCase() === newTask.name.trim().toLowerCase() &&
      t.employeeId === newTask.employeeId &&
      normalizeDate(t.date) === newDate
    );
    if (duplicate) {
      return 'Duplikat oppgave';
    }
    return null;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

function normalizeDate(date: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(date);
  if (match) return `${match[3]}-${match[2]}-${match[1]}`;
  return date;
}

function autoId(id: number, tasks: Task[]): string {
  if (id == 0) {
    const maxId = tasks.map(p => p.id ?? 0).reduce((max, curr) => curr > max ? curr : max, 0);
    id = (Number(maxId) + 1);
  }
  return id.toString();
}
