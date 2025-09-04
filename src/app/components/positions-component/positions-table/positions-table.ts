import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Position } from '../../../shared/models/whoDoesWhat';
import { DatePeriodPipe } from '../../../shared/pipes/date-period-pipe';


@Component({
  standalone: true,
  selector: 'app-positions-table-component',
  imports: [
    CommonModule,
    DatePeriodPipe,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './positions-table.html',
  styleUrl: './positions-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class PositionsTableComponent implements OnChanges, AfterViewInit {
  @Input() positions: Position[] = [];
  @Output() edit = new EventEmitter<Position>();
  @Output() remove = new EventEmitter<number>();

  displayedColumns: string[] = ['id', 'name', 'employeeId', 'period', 'actions'];
  dataSource = new MatTableDataSource<Position>([]);

  @ViewChild(MatSort) sort!: MatSort;

  ngOnChanges() {
    this.dataSource.data = this.positions;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  trackById(index: number, item: Position){
    return item.id;
  }
}
