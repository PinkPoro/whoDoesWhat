import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'datePeriod'
})
export class DatePeriodPipe implements PipeTransform {

  transform(dateStr: string): string {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    if (year && month && day) return `${day}.${month}.${year}`;
    return dateStr;
  }

}
