import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Position } from '../../../shared/models/whoDoesWhat';

@Component({
  standalone: true,
  selector: 'app-create-position-dialog-component',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './create-position-dialog.html',
  styleUrls: ['./create-position-dialog.scss']
})
export class CreatePositionDialogComponent {
  private ref = inject(MatDialogRef<CreatePositionDialogComponent>);
  form: Position = { id: 0, name: '', employeeId: 0, period: { start: '', end: '' } };

  onCreate() {
    this.ref.close(this.form);
  }

  onCancel() {
    this.ref.close(null);
  }
}
