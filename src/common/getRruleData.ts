import { RRule } from 'rrule';

export default function getRruleData({
  freq = RRule.WEEKLY,
  dtstart,
  until,
  interval = 1,
  byweekday,
  bymonthday,
  count = 1,
  isCustom,
}: any) {
  if (!isNaN(dtstart?.getTime())) {
    if (isCustom) {
      const all = [dtstart, until];
      const str = `${dtstart}, ${until}`;
      const txt = `Custom ${dtstart}, ${until}`;
      return { all, str, txt };
    } else {
      const rule = new RRule({
        freq,
        interval,
        byweekday,
        bymonthday,
        dtstart,
        until,
        count: byweekday?.[0] || bymonthday?.[0] ? count : count + 1,
      });
      const all = rule.all();
      const str = rule.toString();
      const txt = rule.toText();
      return { all, str, txt };
    }
  }
}

export const getReminderRruleData = ({
  freq = RRule.WEEKLY,
  dtstart,
  until,
  interval = 1,
  byweekday,
  bymonthday,
  count = 1,
}: any) => {
  const rule = new RRule({
    freq,
    dtstart,
    until,
    interval,
    byweekday,
    bymonthday,
    count,
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
