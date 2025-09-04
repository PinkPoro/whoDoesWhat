import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { WhoDoesWhatService } from '../../services/who-does-what-service';
import { TasksActions } from './tasks.actions';

@Injectable() export class TasksEffects {
  private actions$ = inject(Actions);
  private api = inject(WhoDoesWhatService);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.load),
      mergeMap(() => this.api.tasks().pipe(
        map(tasks => TasksActions.loadSuccess({ tasks })),
        catchError(error => of(TasksActions.loadFailure({ error })))
      ))
    )
  );

  save$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.save),
      mergeMap(({ task }) => {
        const call$ = task.id ? this.api.updateTask(task) : this.api.createTask(task);
        return call$.pipe(
          map(saved => TasksActions.saveSuccess({ task: saved })),
          catchError(error => of(TasksActions.saveFailure({ error })))
        );
      })
    )
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.delete),
      mergeMap(({ id }) => this.api.deleteTask(id).pipe(
        map(() => TasksActions.deleteSuccess({ id })),
        catchError(error => of(TasksActions.deleteFailure({ error })))
      ))
    )
  );
}
