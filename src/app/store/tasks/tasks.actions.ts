import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { Task } from '../../shared/models/whoDoesWhat';


export const TasksActions = createActionGroup({
  source: 'Tasks',
  events: {
    'Load': emptyProps(),
    'Load Success': props<{ tasks: Task[] }>(),
    'Load Failure': props<{ error: unknown }>(),
    'Save': props<{ task: Task }>(),                  // create or update
    'Save Success': props<{ task: Task }>(),
    'Save Failure': props<{ error: unknown }>(),
    'Create': props<{ task: Task }>(),                  // create or update
    'Create Success': props<{ task: Task }>(),
    'Create Failure': props<{ error: unknown }>(),
    'Delete': props<{ id: number }>(),
    'Delete Success': props<{ id: number }>(),
    'Delete Failure': props<{ error: unknown }>(),
  }
});
