import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { Employee } from '../../models/whoDoesWhat';

export const EmployeesActions = createActionGroup({
  source: 'Employees',
  events: {
    'Load': emptyProps(),
    'Load Success': props<{ employees: Employee[] }>(),
    'Load Failure': props<{ error: unknown }>(),
    'Save': props<{ employee: Employee }>(),              // create (uten id) / update (med id)
    'Save Success': props<{ employee: Employee }>(),
    'Save Failure': props<{ error: unknown }>(),
    'Delete': props<{ id: number }>(),
    'Delete Success': props<{ id: number }>(),
    'Delete Failure': props<{ error: unknown }>(),
  }
});
