import { Pipe, PipeTransform } from '@angular/core';
import { Position } from '../../models/whoDoesWhat';

@Pipe({
  standalone: true,
  name: 'positionsFilter',
  pure: true,
})
export class PositionsFilterPipe implements PipeTransform {
  transform(
    positions: Position[] | null,
    query: string = '',
    employeeId?: number | null,
    fromDate?: string,
    toDate?: string,
    onlyCurrent = false
  ): Position[] {
    if (!positions) return [];

    // Normaliser søkestrengen
    const normalizedQuery = query.trim().toLowerCase();

    // Konverter datoer til timestamp for enkel sammenligning
    const toTimestamp = (date?: string) =>
      date ? new Date(date + 'T00:00:00').getTime() : NaN;

    const fromTimestamp = toTimestamp(fromDate);
    const toTimestampLimit = toTimestamp(toDate);

    // Dagens dato (midnatt)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const now = today.getTime();

    return positions.filter((position) => {
      // Filter på søkestreng
      if (
        normalizedQuery &&
        !position.name.toLowerCase().includes(normalizedQuery)
      ) {
        return false;
      }

      // Filter på ansatt-ID
      if (employeeId && position.employeeId !== employeeId) {
        return false;
      }

      // Hent periode-start og -slutt
      const startTimestamp = toTimestamp(position.period.start);
      const endTimestamp = toTimestamp(position.period.end);

      // Filter: kun aktive nå
      if (onlyCurrent && !(startTimestamp <= now && now <= endTimestamp)) {
        return false;
      }

      // Filter: fra-dato
      if (!isNaN(fromTimestamp) && endTimestamp < fromTimestamp) {
        return false;
      }

      // Filter: til-dato
      if (!isNaN(toTimestampLimit) && startTimestamp > toTimestampLimit) {
        return false;
      }

      return true;
    });
  }
}
