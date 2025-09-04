import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { TasksActions } from './tasks.actions';
import { Task } from '../../models/whoDoesWhat';


export interface TasksState extends EntityState<Task> { loading: boolean; error?: unknown; }
export const tasksAdapter = createEntityAdapter<Task>({ selectId: t => t.id!, sortComparer: (a,b)=>b.date.localeCompare(a.date) });
export const initialTasksState: TasksState = tasksAdapter.getInitialState({ loading:false });

export const tasksReducer = createReducer(
  initialTasksState,
  on(TasksActions.load, s => ({ ...s, loading: true, error: undefined })),
  on(TasksActions.loadSuccess, (s, { tasks }) => tasksAdapter.setAll(tasks, { ...s, loading: false })),
  on(TasksActions.loadFailure, (s, { error }) => ({ ...s, loading: false, error })),
  on(TasksActions.saveSuccess, (s, { task }) => tasksAdapter.upsertOne(task, s)),
  on(TasksActions.deleteSuccess, (s, { id }) => tasksAdapter.removeOne(id, s)),
);
