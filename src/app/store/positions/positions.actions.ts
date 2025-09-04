import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { Position } from '../../models/whoDoesWhat';

export const PositionsActions = createActionGroup({
  source: 'Positions',
  events: {
    'Load': emptyProps(),
    'Load Success': props<{ positions: Position[] }>(),
    'Load Failure': props<{ error: unknown }>(),
    'Save': props<{ position: Position }>(),
    'Save Success': props<{ position: Position }>(),
    'Save Failure': props<{ error: unknown }>(),
    'Delete': props<{ id: number }>(),
    'Delete Success': props<{ id: number }>(),
    'Delete Failure': props<{ error: unknown }>(),
  }
});
