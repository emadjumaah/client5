import { RRule } from 'rrule';

const start = new Date(Date.UTC(2012, 1, 1, 10, 30));
const end = null;

export default function getRruleData({
  freq = RRule.WEEKLY,
  byweekday,
  dtstart = start,
  until = end,
  interval = 1,
  count = 1,
}) {
  const rule =
    freq !== RRule.DAILY
      ? new RRule({
          freq,
          interval,
          byweekday,
          dtstart,
          until,
          count: count + 1,
        })
      : new RRule({ freq, interval, byweekday, dtstart, until, count });
  const all = rule.all();
  const str = rule.toString();
  const txt = rule.toText();

  return { all, str, txt };
}
