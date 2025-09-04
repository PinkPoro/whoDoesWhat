import { Pipe, PipeTransform } from '@angular/core';
import { Employee } from '../../models/whoDoesWhat';

@Pipe({
  standalone: true,
  name: 'employeesFilterPipe',
  pure: true
})
export class EmployeesFilterPipePipe implements PipeTransform {

 transform(items: Employee[] | null, q = ''): Employee[] {
    if (!items) return [];
    const k = q.trim().toLowerCase();
    return k ? items.filter(e => e.name.toLowerCase().includes(k)) : items;
  }

}
