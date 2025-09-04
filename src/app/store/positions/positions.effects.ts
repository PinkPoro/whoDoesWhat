import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, map, mergeMap, of } from 'rxjs';
import { WhoDoesWhatService } from '../../services/who-does-what-service';
import { PositionsActions } from './positions.actions';

@Injectable()
export class PositionsEffects {
  private actions$ = inject(Actions);
  private api = inject(WhoDoesWhatService);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PositionsActions.load),
      mergeMap(() => this.api.getPositions().pipe(
        map(positions => PositionsActions.loadSuccess({ positions })),
        catchError(error => of(PositionsActions.loadFailure({ error })))
      ))
    )
  );

  save$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PositionsActions.save),
      mergeMap(({ position }) => {
        const call$ = position.id ? this.api.updatePosition(position) : this.api.createPosition(position);
        return call$.pipe(
          map(p => PositionsActions.saveSuccess({ position: p })),
          catchError(error => of(PositionsActions.saveFailure({ error })))
        );
      })
    )
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PositionsActions.create),
      mergeMap(({ position }) => {
        const call$ = position.id ? this.api.createPosition(position) : this.api.createPosition(position);
        return call$.pipe(
          map(p => PositionsActions.createSuccess({ position: p })),
          catchError(error => of(PositionsActions.createFailure({ error })))
        );
      })
    )
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PositionsActions.delete),
      mergeMap(({ id }) => this.api.deletePosition(id).pipe(
        map(() => PositionsActions.deleteSuccess({ id })),
        catchError(error => of(PositionsActions.deleteFailure({ error })))
      ))
    )
  );
}
