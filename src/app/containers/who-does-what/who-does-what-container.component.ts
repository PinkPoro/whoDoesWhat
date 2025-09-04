import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PositionsContainerComponent } from '../positions-container/positions-container.component';
import { EmployeeContainerComponent } from '../employee-container/employee-container';
import { TaskContainerComponent } from '../task-container/task-container';

@Component({
  standalone: true,
  selector: 'app-who-does-what-container-component',
  imports: [
    CommonModule,
    PositionsContainerComponent,
    EmployeeContainerComponent,
    TaskContainerComponent
  ],
  templateUrl: './who-does-what-container.component.html',
  styleUrls: ['./who-does-what-container.component.scss']
})
export class WhoDoesWhatContainerComponent {

}
