import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { Task } from '../../../shared/models/whoDoesWhat';

@Component({
  standalone: true,
  selector: 'app-edit-task-component',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule],
  templateUrl: './edit-task-component.html',
  styleUrls: ['./edit-task-component.scss']
})
export class EditTaskComponent {
  @Input() form: Task = { id: 0, name: '', employeeId: 0, date: '' };
  @Output() save = new EventEmitter<Task>();
  @Output() cancel = new EventEmitter<void>();

  onSave() {
    this.save.emit(this.form);
  }

  onCancel() {
    this.cancel.emit();
  }
}
