import { Routes } from '@angular/router';
import { AppComponent } from './app';
import { EmployeesComponent } from './components/employees-component/employees-component';
import { TasksComponent } from './components/tasks-component/tasks-component';


export const routes: Routes = [
  { path: '', component: AppComponent },          // dashboard (validering + oversikt)
  { path: 'employees', component: EmployeesComponent },
  { path: 'tasks', component: TasksComponent },
];
