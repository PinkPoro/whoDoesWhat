import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Position } from '../../models/whoDoesWhat';
import { MaterialModule } from '../../shared/modules/material/material-module';


@Component({
  selector: 'app-position-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './position-dialog.component.html',
})
export class PositionDialogComponent {
  form: FormGroup;

  constructor(
    fb: FormBuilder,
    private ref: MatDialogRef<PositionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Position | null
  ) {
    this.form = fb.group({
      id: [data?.id ?? null],
      name: [data?.name ?? '', [Validators.required, Validators.maxLength(120)]],
      employeeId: [data?.employeeId ?? null, [Validators.required, Validators.min(1)]],
      start: [data?.period?.start ?? '', Validators.required],
      end:   [data?.period?.end   ?? '', Validators.required],
    });
  }

  save() {
    if (this.form.invalid) return;
    const v = this.form.value;
    const position: Position = {
      id: v.id ?? undefined,
      name: v.name,
      employeeId: Number(v.employeeId),
      period: { start: v.start, end: v.end },
    };
    this.ref.close(position);
  }

  cancel() { this.ref.close(null); }
}
