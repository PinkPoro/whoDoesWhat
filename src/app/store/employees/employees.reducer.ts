import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Employee } from '../../models/whoDoesWhat';
import { EmployeesActions } from './employees.actions';


export interface EmployeesState extends EntityState<Employee> {
  loading: boolean;
  error?: unknown;
}

export const employeesAdapter = createEntityAdapter<Employee>({
  selectId: e => e.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name)
});

export const initialEmployeesState: EmployeesState =
  employeesAdapter.getInitialState({ loading: false });

export const employeesReducer = createReducer(
  initialEmployeesState,
  on(EmployeesActions.load, s => ({ ...s, loading: true, error: undefined })),
  on(EmployeesActions.loadSuccess, (s, { employees }) =>
    employeesAdapter.setAll(employees, { ...s, loading: false })),
  on(EmployeesActions.loadFailure, (s, { error }) => ({ ...s, loading: false, error })),

  on(EmployeesActions.saveSuccess, (s, { employee }) => employeesAdapter.upsertOne(employee, s)),
  on(EmployeesActions.deleteSuccess, (s, { id }) => employeesAdapter.removeOne(id, s)),
);
