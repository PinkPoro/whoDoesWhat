import { Routes } from '@angular/router';
import { AppComponent } from './app';
import { EmployeesComponent } from './employees-component/employees-component';
import { PositionsComponent } from './positions-component/positions-component';
import { TasksComponent } from './tasks-component/tasks-component';

export const routes: Routes = [
  { path: '', component: AppComponent },          // dashboard (validering + oversikt)
  { path: 'employees', component: EmployeesComponent },
  { path: 'positions', component: PositionsComponent },
  { path: 'tasks', component: TasksComponent },
];
