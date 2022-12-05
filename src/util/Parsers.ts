import { Event } from '../services/FightParser';
import Logger from '../services/Logging/Logger';

// UFC Date Parser
// Sat, Feb 19 / 7:00 PM EST
export function eventToDate(logger: Logger, event: Event): Date {
  let raw = event.date;
  logger.debug(`raw: ${raw}`)

  let rawDate = raw.split('/').shift();
  logger.debug(`rawDate: ${rawDate}`)
  let monthDate = rawDate.split(',').pop().trim();
  logger.debug(`monthDate: ${monthDate}`)
  let month = monthDate.split(' ').shift().trim();
  logger.debug(`month: ${month}`)
  let dayOfMonth = monthDate.split(' ').pop().trim();
  logger.debug(`dayOfMonth: ${dayOfMonth}`)

  let time = raw.split('/').pop().trim();
  logger.debug(`time: ${time}`)

  const now = new Date(Date.now());
  let date = new Date(`${month} ${dayOfMonth} ${time}`);

  if(now.getMonth() > date.getMonth()) {
    date.setFullYear(now.getFullYear() + 1);
  }
  else {
    date.setFullYear(now.getFullYear());
  }
  logger.debug(`date: ${date}`)

  return date;
}
