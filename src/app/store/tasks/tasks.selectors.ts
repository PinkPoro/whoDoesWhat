import { createFeatureSelector } from '@ngrx/store';
import { tasksAdapter, TasksState } from './tasks.reducer';

export const selectTasksState = createFeatureSelector<TasksState>('tasks');

export const {
  selectAll: selectAllTasks,
  selectEntities: selectTaskEntities,
  selectIds: selectTaskIds,
  selectTotal: selectTasksTotal,
} = tasksAdapter.getSelectors(selectTasksState);

// valgfritt: behold disse hvis du bruker dem et annet sted
export const selectTasksLoading = (state: any) => state.tasks.loading as boolean;
export const selectTasksError   = (state: any) => state.tasks.error;
