import { Component, inject } from '@angular/core';
import { Position } from '../../../shared/models/whoDoesWhat';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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
  styleUrl: './create-position-dialog.scss'
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
