import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { Position } from '../../../shared/models/whoDoesWhat';

@Component({
  standalone: true,
  selector: 'app-update-position-form-component',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './update-position-form.html',
  styleUrls: ['./update-position-form.scss']
})
export class UpdatePositionsFormComponent {
  @Input() form: Position = { id: 0, name: '', employeeId: 0, period: { start: '', end: '' } };
  @Output() save = new EventEmitter<Position>();
  @Output() cancel = new EventEmitter<void>();

  onSave() {
    this.save.emit(this.form);
  }

  onCancel() {
    this.cancel.emit();
  }
}
