import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../shared/modules/material/material-module';
import { Employee } from '../../models/whoDoesWhat';


@Component({
  selector: 'app-employee-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './employees-dialog.component.html',
})
export class EmployeeDialogComponent {
  form: FormGroup;

  constructor(
    fb: FormBuilder,
    private ref: MatDialogRef<EmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Employee | null
  ) {
    this.form = fb.group({
      id: [data?.id ?? null],
      name: [data?.name ?? '', [Validators.required, Validators.maxLength(120)]],
    });
  }

  save() {
    if (this.form.invalid) return;
    const v = this.form.value;
    const employee: Employee = {
      id: v.id ?? undefined,
      name: v.name,
    };
    this.ref.close(employee);
  }

  cancel() {
    this.ref.close(null);
  }
}
