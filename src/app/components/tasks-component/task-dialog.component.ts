import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../shared/modules/material/material-module';
import { Task } from '../../shared/models/whoDoesWhat';


@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './task-dialog.component.html',
})
export class TaskDialogComponent {
  form: FormGroup;

  constructor(
    fb: FormBuilder,
    private ref: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task | null
  ) {
    this.form = fb.group({
      id: [data?.id ?? null],
      name: [data?.name ?? '', [Validators.required, Validators.maxLength(120)]],
      employeeId: [data?.employeeId ?? null, [Validators.required]],
      date: [data?.date ?? '', Validators.required],
    });
  }

  save() {
    if (this.form.invalid) return;
    const v = this.form.value;
    const task: Task = {
      id: v.id ?? undefined,
      name: v.name,
      employeeId: Number(v.employeeId),
      date: v.date,
    };
    this.ref.close(task);
  }

  cancel() {
    this.ref.close(null);
  }
}
