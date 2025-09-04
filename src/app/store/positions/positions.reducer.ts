import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Position } from '../../models/whoDoesWhat';
import { PositionsActions } from './positions.actions';


export interface PositionsState extends EntityState<Position> {
  loading: boolean;
  error?: unknown;
}

export const positionsAdapter = createEntityAdapter<Position>({
  selectId: p => p.id!, // json-server gir id ved create
  // sorter på startdato, så id
  sortComparer: (a, b) => {
    const c = a.period.start.localeCompare(b.period.start);
    return c !== 0 ? c : ((a.id ?? 0) - (b.id ?? 0));
  }
});

export const initialPositionsState: PositionsState =
  positionsAdapter.getInitialState({ loading: false });

export const positionsReducer = createReducer(
  initialPositionsState,
  on(PositionsActions.load, s => ({ ...s, loading: true, error: undefined })),
  on(PositionsActions.loadSuccess, (s, { positions }) =>
    positionsAdapter.setAll(positions, { ...s, loading: false })),
  on(PositionsActions.loadFailure, (s, { error }) => ({ ...s, loading: false, error })),

  on(PositionsActions.saveSuccess, (s, { position }) => positionsAdapter.upsertOne(position, s)),
  on(PositionsActions.deleteSuccess, (s, { id }) => positionsAdapter.removeOne(id, s)),
);
