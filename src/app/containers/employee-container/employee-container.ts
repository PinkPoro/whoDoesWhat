import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ValidationService } from '../../services/validation-service';
import { EmployeesActions } from '../../store/employees/employees.actions';

import { EmployeesTableComponent } from '../../components/employees-component/employees-table/employees-table';
import { NewEmployeeDialogComponent } from '../../components/employees-component/new-employee-dialog/new-employee-dialog';
import { Employee } from '../../shared/models/whoDoesWhat';

@Component({
  standalone: true,
  selector: 'app-employee-container-component',
  imports: [
    CommonModule,
    FormsModule,
    EmployeesTableComponent,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './employee-container.html',
  styleUrls: ['./employee-container.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeContainerComponent implements OnDestroy, OnChanges {
  @Input() employees: Employee[] = [];

  @Output() create = new EventEmitter<Employee>();

  private dialog = inject(MatDialog);
  private subscriptions: Subscription = new Subscription();
  private validationService = inject(ValidationService);
  private snackBar = inject(MatSnackBar);
  private store = inject(Store);

  searchTerm = '';
  filteredEmployees: Employee[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employees']) {
      this.applyFilter();
    }
  }

  openCreateDialog() {
    const ref = this.dialog.open(NewEmployeeDialogComponent, { width: '400px' });
    this.subscriptions.add(ref.afterClosed().subscribe(result => {
      if (result) {
        let id = result.id;
        if (id == 0) {
          const maxId = this.employees.map(e => e.id ?? 0).reduce((max, curr) => curr > max ? curr : max, 0);
          id = (Number(maxId) + 1);
        }
        const payload: Employee = { id: id.toString(), name: result.name };
        this.onCreateEmployee(payload);
      }
    }));
  }

  onCreateEmployee(employee: Employee) {
    const error = this.validationService.validateEmployee(employee, this.employees);
    if (error) {
      this.snackBar.open(error, 'Lukk', { duration: 4000 });
      return;
    }
    this.store.dispatch(EmployeesActions.create({ employee: employee }));
  }

  onSearch(term: string) {
    this.searchTerm = term;
    this.applyFilter();
  }

  applyFilter() {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredEmployees = this.employees.filter(emp =>
      emp.name.toLowerCase().includes(term) ||
      (emp.id !== undefined && String(emp.id).includes(term))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
