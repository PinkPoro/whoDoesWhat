import { createFeatureSelector } from '@ngrx/store';
import { positionsAdapter, PositionsState } from './positions.reducer';

export const selectPositionsState = createFeatureSelector<PositionsState>('positions');
export const {
  selectAll: selectAllPositions,
  selectEntities: selectPositionEntities,
  selectIds: selectPositionIds,
  selectTotal: selectPositionsTotal
} = positionsAdapter.getSelectors(selectPositionsState);
