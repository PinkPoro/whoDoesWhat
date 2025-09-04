import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Employee } from '../../../shared/models/whoDoesWhat';

@Component({
  standalone: true,
  selector: 'app-new-employee-dialog-component',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './new-employee-dialog.html',
  styleUrl: './new-employee-dialog.scss'
})
export class NewEmployeeDialogComponent {
  private ref = inject(MatDialogRef<NewEmployeeDialogComponent>);
  form: Employee = { id: 0, name: '' };

  onCreate() {
    this.ref.close(this.form);
  }

  onCancel() {
    this.ref.close(null);
  }

}
