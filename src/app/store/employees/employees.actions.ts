import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { Employee } from '../../shared/models/whoDoesWhat';

export const EmployeesActions = createActionGroup({
  source: 'Employees',
  events: {
    'Load': emptyProps(),
    'Load Success': props<{ employees: Employee[] }>(),
    'Load Failure': props<{ error: unknown }>(),
    'Create': props<{ employee: Employee }>(),
    'Create Success': props<{ employee: Employee }>(),
    'Create Failure': props<{ error: unknown }>(),
  }
});
