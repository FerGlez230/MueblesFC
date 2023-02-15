import * as dayjs from 'dayjs';

export class DatesHelper {
  // eslint-disable-next-line prettier/prettier
  getWeeksBetween(mostRecentDate: string | Date, initialDate: string | Date): number {
    const date1 = dayjs(mostRecentDate);
    return date1.diff(dayjs(initialDate), 'week');
  }
}
