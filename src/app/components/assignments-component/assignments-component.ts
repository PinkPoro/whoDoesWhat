import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';

import { Assignment } from './../../shared/models/whoDoesWhat';

@Component({
  standalone: true,
  selector: 'app-assignments-component',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule
  ],
  templateUrl: './assignments-component.html',
  styleUrl: './assignments-component.scss'
})
export class AssignmentsComponent implements OnChanges {
  @Input() assignments: Assignment[] = [];

  searchTerm = '';
  filteredAssignments: Assignment[] = [];
  displayedColumns: string[] = ['employee', 'positions', 'tasks'];

  ngOnChanges(): void {
    this.applyFilter();
  }

  onSearch(term: string) {
    this.searchTerm = term;
    this.applyFilter();
  }

  applyFilter() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredAssignments = this.assignments;
      return;
    }
    this.filteredAssignments = this.assignments.filter(a =>
      a.employee.name.toLowerCase().includes(term) ||
      a.positions.some(p =>
        p.position.name.toLowerCase().includes(term) ||
        p.tasks.some(t => t.name.toLowerCase().includes(term))
      )
    );
  }
}
