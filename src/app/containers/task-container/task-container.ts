import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { TasksTableComponent } from '../../components/tasks-component/tasks-table/tasks-table';
import { Store } from '@ngrx/store';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { Task } from '../../shared/models/whoDoesWhat';
import { TasksActions } from '../../store/tasks/tasks.actions';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { selectAllTasks } from '../../store/tasks/tasks.selectors';
import { MatDialog } from '@angular/material/dialog';
import { CreateTaskDialogComponent } from '../../components/tasks-component/create-task-dialog/create-task-dialog';
import { EditTaskComponent } from '../../components/tasks-component/edit-task-component/edit-task-component';
import { MatSnackBar } from '@angular/material/snack-bar';

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
export class TaskContainerComponent implements OnDestroy {
  private store = inject(Store);
  private dialog = inject(MatDialog);
  private subscriptions: Subscription = new Subscription();
  private destroy$ = new Subject<void>();
  private snackBar = inject(MatSnackBar);

  task: Task[] = [];
  searchTerm = '';
  filteredTasks: Task[] = [];
  form: Task = { id: 0, name: '', employeeId: 0, date: '' };
  showEditForm = false;

  constructor() {
    this.store.dispatch(TasksActions.load());
    this.subscriptions.add(this.store.select(selectAllTasks)
      .pipe(takeUntil(this.destroy$))
      .subscribe(rows => {this.task = rows; this.applyFilter();}));
  }

  openCreateDialog() {
    const ref = this.dialog.open(CreateTaskDialogComponent, { width: '400px' });
    this.subscriptions.add(ref.afterClosed().subscribe(result => {
      if (result) {
        let id = result.id;
        if (id == 0) {
          const maxId = this.task.map(p => p.id ?? 0).reduce((max, curr) => curr > max ? curr : max, 0);
          id = (Number(maxId) + 1);
        }
        const payload = { ...result, id: id.toString() };
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

  validateTask(newTask: Task, isEdit: boolean = false): string | null {
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
    this.destroy$.next();
    this.destroy$.complete();

    this.subscriptions.unsubscribe();
  }
}

function normalizeDate(date: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(date);
  if (match) return `${match[3]}-${match[2]}-${match[1]}`;
  return date;
}
