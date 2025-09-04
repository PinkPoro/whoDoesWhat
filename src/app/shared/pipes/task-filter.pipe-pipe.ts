import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../../models/whoDoesWhat';

@Pipe({
  standalone: true,
  name: 'tasksFilter',
  pure: true,
})
export class TasksFilterPipe implements PipeTransform {
  transform(
    tasks: Task[] | null,
    query: string = '',
    employeeId?: number | null,
    fromDate?: string,
    toDate?: string
  ): Task[] {
    if (!tasks) return [];

    // Gjør søkestrengen klar for sammenligning
    const normalizedQuery = query.trim().toLowerCase();

    // Konverter dato-strenger til tidsstempel for enklere sammenligning
    const toTimestamp = (date?: string) =>
      date ? new Date(date + 'T00:00:00').getTime() : NaN;

    const fromTimestamp = toTimestamp(fromDate);
    const toTimestampLimit = toTimestamp(toDate);

    return tasks.filter((task) => {
      // Filter på søkestreng
      if (
        normalizedQuery &&
        !task.name.toLowerCase().includes(normalizedQuery)
      ) {
        return false;
      }

      // Filter på ansatt-ID
      if (employeeId && task.employeeId !== employeeId) {
        return false;
      }

      // Filter på dato-intervallet
      const taskDate = toTimestamp(task.date);
      if (!isNaN(fromTimestamp) && taskDate < fromTimestamp) {
        return false;
      }
      if (!isNaN(toTimestampLimit) && taskDate > toTimestampLimit) {
        return false;
      }

      return true;
    });
  }
}
