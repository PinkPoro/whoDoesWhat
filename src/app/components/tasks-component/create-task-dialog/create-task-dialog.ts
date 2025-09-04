import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { Task } from '../../../shared/models/whoDoesWhat';

@Component({
  standalone: true,
  selector: 'app-create-task-dialog-component',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './create-task-dialog.html',
  styleUrls: ['./create-task-dialog.scss']
})
export class CreateTaskDialogComponent {
  private ref = inject(MatDialogRef<CreateTaskDialogComponent>);
  form: Task = { id: 0, name: '', employeeId: 0, date: '' };

  onCreate() {
    this.ref.close(this.form);
  }

  onCancel() {
    this.ref.close(null);
  }
}
