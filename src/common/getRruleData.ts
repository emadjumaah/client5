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
}: any) {
  const rule = new RRule({
    freq,
    interval,
    byweekday,
    dtstart,
    until,
    count: byweekday ? count : count + 1,
  });
  const all = rule.all();
  const str = rule.toString();
  const txt = rule.toText();

  return { all, str, txt };
}
export const getReminderRruleData = ({
  freq = RRule.DAILY,
  byweekday,
  dtstart = start,
  until = end,
  interval = 1,
  count = 1,
}) => {
  const rule = new RRule({
    freq,
    interval,
    byweekday,
    dtstart,
    until,
    count: count,
  });
  const all = rule.all();
  const str = rule.toString();
  const txt = rule.toText();

  return { all, str, txt };
};

export const isToday = (someDate: any) => {
  const today = new Date();
  return (
    someDate.getDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear()
  );
};
