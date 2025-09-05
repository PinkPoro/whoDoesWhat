import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  styleUrl: './employee-container.scss'
})
export class EmployeeContainerComponent implements OnDestroy, OnChanges {
  @Input() employees: Employee[] = [];

  private store = inject(Store);
  private dialog = inject(MatDialog);
  private subscriptions: Subscription = new Subscription();
  private snackBar = inject(MatSnackBar);

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
        this.onCreate(payload);
      }
    }));
  }

  onCreate(form: Employee) {
    const error = this.validateEmployee(form);
    if (error) {
      this.snackBar.open(error, 'Lukk', { duration: 4000 });
      return;
    }
    this.store.dispatch(EmployeesActions.create({ employee: form }));
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

  validateEmployee(e: Employee): string | null {
    const duplicate = this.employees.some(emp =>
      emp.name.trim().toLowerCase() === e.name.trim().toLowerCase()
    );
    if (duplicate) {
      return 'En ansatt med dette navnet finnes allerede.';
    }
    return null;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
