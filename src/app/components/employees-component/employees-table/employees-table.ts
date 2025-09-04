import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Employee } from '../../../shared/models/whoDoesWhat';

@Component({
  standalone: true,
  selector: 'app-employees-table-component',
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './employees-table.html',
  styleUrl: './employees-table.scss'
})
export class EmployeesTableComponent implements OnChanges, AfterViewInit {
  @Input() employee: Employee[] = [];

  displayedColumns: string[] = ['id', 'name'];
  dataSource = new MatTableDataSource<Employee>([]);

  @ViewChild(MatSort) sort!: MatSort;

  ngOnChanges() {
    this.dataSource.data = this.employee;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  trackById(index: number, item: Employee){
    return item.id;
  }
}
