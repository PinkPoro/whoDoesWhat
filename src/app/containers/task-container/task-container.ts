import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

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

  @Output() create = new EventEmitter<Task>();
  @Output() save = new EventEmitter<Task>();
  @Output() remove = new EventEmitter<number>();

  private dialog = inject(MatDialog);
  private subscriptions: Subscription = new Subscription();;

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
    this.save.emit(form);
    this.onReset();
  }

  onEdit(task: Task) {
    this.form = { ...task };
    this.showEditForm = true;
  }

  onCreate(form: Task) {
    this.create.emit(form);
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
    this.remove.emit(id);
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

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

function autoId(id: number, tasks: Task[]): string {
  if (id == 0) {
    const maxId = tasks.map(p => p.id ?? 0).reduce((max, curr) => curr > max ? curr : max, 0);
    id = (Number(maxId) + 1);
  }
  return id.toString();
}
