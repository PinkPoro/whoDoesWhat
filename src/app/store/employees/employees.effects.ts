import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, map, mergeMap, of } from 'rxjs';
import { WhoDoesWhatService } from '../../services/who-does-what-service';
import { EmployeesActions } from './employees.actions';

@Injectable()
export class EmployeesEffects {
  private actions$ = inject(Actions);
  private api = inject(WhoDoesWhatService);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeesActions.load),
      mergeMap(() => this.api.employees().pipe(
        map(employees => EmployeesActions.loadSuccess({ employees })),
        catchError(error => of(EmployeesActions.loadFailure({ error })))
      ))
    )
  );

  save$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeesActions.save),
      mergeMap(({ employee }) => {
        const call$ = employee.id ? this.api.updateEmployee(employee) : this.api.createEmployee(employee);
        return call$.pipe(
          map(e => EmployeesActions.saveSuccess({ employee: e })),
          catchError(error => of(EmployeesActions.saveFailure({ error })))
        );
      })
    )
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeesActions.delete),
      mergeMap(({ id }) => this.api.deleteEmployee(id).pipe(
        map(() => EmployeesActions.deleteSuccess({ id })),
        catchError(error => of(EmployeesActions.deleteFailure({ error })))
      ))
    )
  );
}
