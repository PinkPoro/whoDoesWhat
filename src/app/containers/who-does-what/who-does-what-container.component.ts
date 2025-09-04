import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PositionsContainerComponent } from '../positions-container/positions-container.component';

@Component({
  standalone: true,
  selector: 'app-who-does-what-container-component',
  imports: [CommonModule, PositionsContainerComponent],
  templateUrl: './who-does-what-container.component.html',
  styleUrls: ['./who-does-what-container.component.scss']
})
export class WhoDoesWhatContainerComponent {

}
