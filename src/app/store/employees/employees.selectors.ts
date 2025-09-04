import { createFeatureSelector } from '@ngrx/store';
import { employeesAdapter, EmployeesState } from './employees.reducer';

export const selectEmployeesState = createFeatureSelector<EmployeesState>('employees');
export const {
  selectAll: selectAllEmployees,
  selectEntities: selectEmployeeEntities,
  selectIds: selectEmployeeIds,
  selectTotal: selectEmployeesTotal
} = employeesAdapter.getSelectors(selectEmployeesState);
