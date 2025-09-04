import { Pipe, PipeTransform } from '@angular/core';

type Primitive = string | number | boolean | null | undefined;

export interface EntityFilterOptions {
  // Tekst-søk
  query?: string;
  nameKey?: string;         // default: 'name'

  // Ansatt-filter
  employeeId?: number | null;
  employeeKey?: string;     // default: 'employeeId'

  // Dato-filter (velg ETT av oppsettene under)
  // 1) Enkelt dato-felt (Tasks): f.eks. 'date'
  dateKey?: string;

  // 2) Periode-felt (Positions): f.eks. 'period.start' og 'period.end'
  startKey?: string;
  endKey?: string;

  // Felles datoperiode-filter
  fromDate?: string;        // 'YYYY-MM-DD'
  toDate?: string;          // 'YYYY-MM-DD'
  onlyCurrent?: boolean;    // kun for periode (start/end)
}

@Pipe({
  standalone: true,
  name: 'entityFilter',
  pure: true,
})
export class EntityFilterPipe implements PipeTransform {

  transform<T extends Record<string, any>>(items: T[] | null, options: EntityFilterOptions = {}): T[] {
    if (!items || !items.length) return [];

    const {
      query = '',
      nameKey = 'name',
      employeeId,
      employeeKey = 'employeeId',
      dateKey,
      startKey,
      endKey,
      fromDate,
      toDate,
      onlyCurrent = false,
    } = options;

    const normalizedQuery = (query ?? '').trim().toLowerCase();

    const toTimestamp = (date?: string) =>
      date ? new Date(date + 'T00:00:00').getTime() : NaN;

    const fromTs = toTimestamp(fromDate);
    const toTs   = toTimestamp(toDate);

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const now = today.getTime();

    const get = (obj: any, path?: string): Primitive => {
      if (!path) return undefined;
      return path.split('.').reduce((acc: any, key: string) => (acc == null ? acc : acc[key]), obj);
    };

    const hasPeriod = !!(startKey && endKey);
    const hasSingleDate = !!dateKey && !hasPeriod;

    return items.filter((item) => {
      // 1) Tekst-søk
      if (normalizedQuery) {
        const nameVal = String(get(item, nameKey) ?? '').toLowerCase();
        if (!nameVal.includes(normalizedQuery)) return false;
      }

      // 2) Ansatt-filter
      if (employeeId) {
        const empVal = Number(get(item, employeeKey));
        if (empVal !== employeeId) return false;
      }

      // 3) Dato/Periode-filter
      if (hasSingleDate) {
        const d = toTimestamp(String(get(item, dateKey)));
        if (!isNaN(fromTs) && d < fromTs) return false;
        if (!isNaN(toTs)   && d > toTs)   return false;
        return true;
      }

      if (hasPeriod) {
        const start = toTimestamp(String(get(item, startKey)));
        const end   = toTimestamp(String(get(item, endKey)));

        if (onlyCurrent && !(start <= now && now <= end)) return false;
        if (!isNaN(fromTs) && end   < fromTs) return false; // helt før intervallet
        if (!isNaN(toTs)   && start > toTs)   return false; // helt etter intervallet
        return true;
      }

      // Ingen dato-keys oppgitt → kun query/employee-filter
      return true;
    });
  }
}
