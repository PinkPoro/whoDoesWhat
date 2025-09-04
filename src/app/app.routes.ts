import { Routes } from '@angular/router';
import { AppComponent } from './app';
import { TasksComponent } from './components/tasks-component/tasks-component';


export const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'tasks', component: TasksComponent },
];
