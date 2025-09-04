import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { DatePeriodPipe } from '../../../shared/pipes/date-period-pipe';
import { Task } from '../../../shared/models/whoDoesWhat';

@Component({
  standalone: true,
  selector: 'app-tasks-table-component',
  imports: [
    CommonModule,
    DatePeriodPipe,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './tasks-table.html',
  styleUrls: ['./tasks-table.scss']
})
export class TasksTableComponent implements OnChanges, AfterViewInit {
  @Input() tasks: Task[] = [];
  @Output() edit = new EventEmitter<Task>();
  @Output() remove = new EventEmitter<number>();

  displayedColumns: string[] = ['id', 'name', 'employeeId', 'date', 'actions'];
  dataSource = new MatTableDataSource<Task>([]);

  @ViewChild(MatSort) sort!: MatSort;

  ngOnChanges() {
    this.dataSource.data = this.tasks;
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  trackById(index: number, item: Task){
    return item.id;
  }
}
