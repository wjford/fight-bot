import { Event } from '../services/FightParser';
import Logger from '../services/Logging/Logger';

// UFC Date Parser
// Sat, Feb 19 / 7:00 PM EST
export function eventToDate(logger: Logger, event: Event): Date {
  const raw = event.date;
  logger.debug(`raw: ${raw}`)

  const rawDate = raw.split('/').shift();
  logger.debug(`rawDate: ${rawDate}`)
  const monthDate = rawDate.split(',').pop().trim();
  logger.debug(`monthDate: ${monthDate}`)
  const month = monthDate.split(' ').shift().trim();
  logger.debug(`month: ${month}`)
  const dayOfMonth = monthDate.split(' ').pop().trim();
  logger.debug(`dayOfMonth: ${dayOfMonth}`)

  const time = raw.split('/').pop().trim();
  logger.debug(`time: ${time}`)

  const now = new Date(Date.now());
  const date = new Date(`${month} ${dayOfMonth} ${time}`);

  if(now.getMonth() > date.getMonth()) {
    date.setFullYear(now.getFullYear() + 1);
  }
  else {
    date.setFullYear(now.getFullYear());
  }
  logger.debug(`date: ${date}`)

  return date;
}
