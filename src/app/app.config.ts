import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { employeesReducer } from './store/employees/employees.reducer';
import { positionsReducer } from './store/positions/positions.reducer';
import { tasksReducer } from './store/tasks/tasks.reducer';
import { EmployeesEffects } from './store/employees/employees.effects';
import { PositionsEffects } from './store/positions/positions.effects';
import { TasksEffects } from './store/tasks/tasks.effects';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    provideStore({
      employees: employeesReducer,
      positions: positionsReducer,
      tasks: tasksReducer,
    }),
    provideEffects([EmployeesEffects, PositionsEffects, TasksEffects]),
  ],
};
