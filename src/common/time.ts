/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {
  getDateDay,
  getDateDayFormat,
  getDateFormat,
  getDateMonthFormat,
} from '../Shared/colorFormat';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const periods = {
  day: 'day',
  month: 'month',
  year: 'year',
};

export const getTarseedDates = () => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  const startThisYear = new Date(year, 0, 1, 0, 0, 0, 0);
  const startThisMonth = new Date(year, month, 1, 0, 0, 0, 0);
  const startThisDay = new Date(year, month, day, 0, 0, 0, 0);

  const pday1 = new Date(year, month, day - 1);
  const pmonth1 = new Date(
    month === 0 ? year - 1 : year,
    month === 0 ? 11 : month - 1,
    1
  );
  const pyear1 = new Date(year - 1, 0, 1);

  const ppday1 = new Date(year, month, day - 2);
  const ppmonth1 = new Date(
    month < 2 ? year - 1 : year,
    month === 0 ? 10 : month === 1 ? 11 : month - 2,
    1
  );
  const ppyear1 = new Date(year - 2, 0, 1);

  const pday = pday1.getDate();
  const pdayMonth = pday1.getMonth();
  const pdayYear = pday1.getFullYear();

  const pmonth = pmonth1.getMonth();
  const pmonthYear = pmonth1.getFullYear();

  const pyear = pyear1.getFullYear();
  const ppday = ppday1.getDate();
  const ppmonth = ppmonth1.getMonth();
  const ppyear = ppyear1.getFullYear();

  const startDay = new Date(pday1);
  startDay.setHours(0, 0, 0, 0);
  const endDay = new Date(pday1);
  endDay.setHours(23, 59, 59, 999);

  const y = pmonth1.getFullYear();
  const m = pmonth1.getMonth();
  const startMonth = new Date(y, m, 1, 0, 0, 0, 0);
  const endMonth = new Date(y, m + 1, 0, 23, 59, 59, 999);

  const yy = pyear1.getFullYear();
  const startYear = new Date(yy, 0, 1, 0, 0, 0, 0);
  const endYear = new Date(yy, 11, 31, 23, 59, 59, 999);

  return {
    day,
    month,
    year,
    pday,
    pmonth,
    pyear,
    ppday,
    ppmonth,
    ppyear,
    startThisYear,
    startThisMonth,
    startThisDay,
    startDay,
    endDay,
    startMonth,
    endMonth,
    startYear,
    endYear,
    pdayMonth,
    pdayYear,
    pmonthYear,
  };
};

export const getDaysMonthsArray = function (s: any, e: any) {
  for (
    var b: any = [], c: any = [], d = new Date(s);
    d <= e;
    d.setDate(d.getDate() + 1)
  ) {
    b.push({ m: d.getMonth(), y: d.getFullYear() });
    c.push({ y: d.getFullYear() });
  }

  const mapmonth = {};
  const months: any = [];
  b.forEach((el: any) => {
    if (!mapmonth[JSON.stringify(el)]) {
      mapmonth[JSON.stringify(el)] = true;
      months.push(el);
    }
  });
  months.pop();
  const mapyear = {};
  const years: any = [];
  c.forEach((el: any) => {
    if (!mapyear[JSON.stringify(el)]) {
      mapyear[JSON.stringify(el)] = true;
      years.push(el);
    }
  });
  years.pop();
  return { months, years };
};

export const getListDaysMonthsYears = (time: any) =>
  getDaysMonthsArray(new Date(time), new Date());

export const getLastDay = () => {
  const day = new Date();
  day.setDate(day.getDate() - 1);
  return day.getDate();
};
export const getLastMonth = () => {
  const month = new Date();
  month.setMonth(month.getMonth() - 1);
  return month.getMonth();
};
export const getLastYear = () => {
  const year = new Date();
  year.setFullYear(year.getFullYear() - 1);
  return year.getFullYear();
};

export const getPreviousDMY = () => {
  const day = getLastDay();
  const month = getLastMonth();
  const year = getLastYear();
  return { day, month, year };
};

export const getStartPeriod = (period: any) => {
  let start: any;
  let num: any;

  const date = new Date();

  if (period === periods.day) {
    start = new Date();
    start.setHours(0, 0, 0, 0);
    num = start.getDate();
  }
  if (period === periods.month) {
    const year = date.getFullYear();
    const month = date.getMonth();
    start = new Date(year, month, 1);
    start.setHours(0, 0, 0, 0);
    num = start.getMonth() + 1;
  }
  if (period === periods.year) {
    start = new Date(date.getFullYear(), 0, 1, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    num = start.getFullYear();
  }
  return { start, num };
};

export const getLastPeriodInfo = (period: any) => {
  if (period === periods.day) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const month = yesterday.getMonth() + 1; //months from 1-12
    const day = yesterday.getDate();
    const year = yesterday.getFullYear();

    const start = new Date(yesterday.setHours(0, 0, 0, 0));
    const end = new Date(yesterday.setHours(23, 59, 59, 999));
    return { day, month, year, start, end };
  }
  if (period === periods.month) {
    const today = new Date();
    const year = today.getFullYear();
    const month = 12;
    const start =
      month === 12 ? new Date(year - 1, 12, 1) : new Date(year, month - 1, 1);
    const end =
      month === 12
        ? new Date(year - 1, 12 + 1, 0)
        : new Date(year, month - 1 + 1, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return { month, year, start, end };
  }
  if (period === periods.year) {
    const lastyear = new Date();
    lastyear.setFullYear(lastyear.getFullYear() - 1);
    const year = lastyear.getFullYear();
    const start = new Date(year, 0, 1, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    const end = new Date(year, 11, 31, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return { year, start, end };
  }
  return { year: null, start: null, end: null };
};

export const getStartEndPeriod = (period: any, date = new Date()) => {
  let start: any;
  let end: any;
  let num: any;

  if (period === periods.day) {
    start = new Date();
    start.setHours(0, 0, 0, 0);
    end = new Date();
    end.setHours(23, 59, 59, 999);
    num = start.getDate();
  }
  if (period === periods.month) {
    const year = date.getFullYear();
    const month = date.getMonth();
    start = new Date(year, month, 1);
    end = new Date(year, month + 1, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    num = start.getMonth() + 1;
  }
  if (period === periods.year) {
    start = new Date(date.getFullYear(), 0, 1, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end = new Date(date.getFullYear(), 11, 31, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    num = start.getFullYear();
  }
  return { start, end, num };
};

export const getPeriods = (period: any) => {
  let start: any;
  let end: any;
  const date = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();

  const startThisYear = new Date(year, 0, 1, 0, 0, 0, 0);
  const endThisYear = new Date(year, 11, 31, 23, 59, 59, 999);
  const startThisMonth = new Date(year, month, 1, 0, 0, 0, 0);
  const endThisMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

  const pmonth1 = new Date(
    month === 0 ? year - 1 : year,
    month === 0 ? 11 : month - 1,
    1
  );
  const pyear1 = new Date(year - 1, 0, 1);

  const y = pmonth1.getFullYear();
  const m = pmonth1.getMonth();
  const startLastMonth = new Date(y, m, 1, 0, 0, 0, 0);
  const endLastMonth = new Date(y, m + 1, 0, 23, 59, 59, 999);

  const yy = pyear1.getFullYear();
  const startLastYear = new Date(yy, 0, 1, 0, 0, 0, 0);
  const endLastYear = new Date(yy, 11, 31, 23, 59, 59, 999);

  if (period === 'cm') {
    start = startThisMonth;
    end = endThisMonth;
  }
  if (period === 'pm') {
    start = startLastMonth;
    end = endLastMonth;
  }
  if (period === 'cy') {
    start = startThisYear;
    end = endThisYear;
  }
  if (period === 'py') {
    start = startLastYear;
    end = endLastYear;
  }
  return { start, end };
};

export const getStartEndEventView = ({ time, view, isRTL, endDate }: any) => {
  if (view === 'Day') {
    const start = new Date(time);
    start.setHours(0, 0, 0, 0);
    const end = new Date(time);
    end.setHours(23, 59, 59, 999);
    const period = getDateDayFormat(time, isRTL);
    return { start, end, period };
  }
  if (view === '3Days') {
    const start = new Date(time);
    start.setHours(0, 0, 0, 0);
    const end = new Date(time);
    end.setDate(end.getDate() + 2);
    end.setHours(23, 59, 59, 999);
    const year = start.getFullYear();
    const period = `${getDateFormat(start, isRTL)} - ${getDateFormat(
      end,
      isRTL
    )} ${year}`;
    return { start, end, period };
  }
  if (view === 'Week') {
    const start = new Date(time);
    const dayno = start.getDay();
    const minnus = dayno === 6 ? 0 : dayno + 1;
    const plus = dayno === 5 ? 0 : dayno === 6 ? 6 : 5 - dayno;

    start.setDate(start.getDate() - minnus);
    start.setHours(0, 0, 0, 0);
    const end = new Date(time);
    end.setDate(end.getDate() + plus);
    end.setHours(23, 59, 59, 999);
    const year = start.getFullYear();
    const period = `${getDateFormat(start, isRTL)} - ${getDateFormat(
      end,
      isRTL
    )} ${year}`;
    return { start, end, period };
  }
  if (view === 'Month') {
    const date = new Date(time);
    const month = date.getMonth();
    const year = date.getFullYear();
    const start = new Date(year, month, 1, 0, 0, 0, 0);
    const end = new Date(year, month + 1, 0, 23, 59, 59, 999);
    const period = getDateMonthFormat(start, isRTL);
    return { start, end, period };
  }
  if (view === 'Year') {
    const date = new Date(time);
    const year = date.getFullYear();
    const start = new Date(year, 0, 1, 0, 0, 0, 0);
    const end = new Date(year, 11, 31, 23, 59, 59, 999);
    const period = `${isRTL ? 'سنة' : 'Year'} ${year}`;
    return { start, end, period };
  }
  if (view === 'Custom') {
    const start = new Date(time);
    start.setHours(0, 0, 0, 0);
    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999);
    const period = getDateDay(time, isRTL);
    const periodEnd = getDateDay(endDate, isRTL);

    return { start, end, period, periodEnd };
  }

  return { start: null, end: null, period: null, periodEnd: null };
};

export const getDaysOfWeek = (time: any) => {
  const start = new Date(time);
  const dayno = start.getDay();
  const minnus = dayno === 6 ? 0 : dayno + 1;
  const plus = dayno === 5 ? 0 : dayno === 6 ? 6 : 5 - dayno;

  start.setDate(start.getDate() - minnus);
  const end = new Date(time);
  end.setDate(end.getDate() + plus);
  const ppriod = `${start.getDate()}/${
    start.getMonth() + 1
  } - ${end.getDate()}/${end.getMonth() + 1}`;
  return ppriod;
};

export const getMonthsArray = function (time: any) {
  const now = new Date();
  const date = new Date(time);
  for (
    var b: any = [], c: any = [];
    now <= date;
    date.setMonth(date.getMonth() + 1)
  ) {
    b.push({ m: date.getMonth(), y: date.getFullYear() });
    c.push({ y: date.getFullYear() });
  }
  const mapmonth: any = {};
  const months: any = [];
  b.forEach((el: any) => {
    if (!mapmonth[JSON.stringify(el)]) {
      mapmonth[JSON.stringify(el)] = true;
      months.push(el);
    }
  });
  months.pop();
  const mapyear: any = {};
  const years: any = [];
  c.forEach((el: any) => {
    if (!mapyear[JSON.stringify(el)]) {
      mapyear[JSON.stringify(el)] = true;
      years.push(el);
    }
  });
  years.pop();
  return { months, years };
};

export const getAppStartEndPeriod = () => {
  const date = new Date();
  const year = date.getFullYear();
  const startPeriod = new Date(year - 1, 0, 1, 0, 0, 0, 0);
  const endPeriod = new Date(year + 1, 11, 31, 23, 59, 59, 999);
  return { startPeriod, endPeriod };
};

export const getLastDays = (days: any, isRTL: any, location = 'start') => {
  const list: any = [];
  if (location === 'mid') {
    const time = new Date();
    const md = Math.ceil(days / 2);
    // const rem = days - md;
    time.setDate(time.getDate() - md);

    for (let i = 0; i < days; i++) {
      time.setDate(time.getDate() + 1);
      list.push(getDateFormat(new Date(time), isRTL));
    }
    return list;
  } else {
    const time = new Date();
    time.setDate(time.getDate() - days);

    for (let i = 0; i < days; i++) {
      time.setDate(time.getDate() + 1);
      list.push(getDateFormat(new Date(time), isRTL));
    }
    return list;
  }
};
export const getLastMonths = (num: any, isRTL: any) => {
  const list: any = [];

  const time = new Date();
  time.setMonth(time.getMonth() - num);

  for (let i = 0; i < num; i++) {
    time.setMonth(time.getMonth() + 1);
    list.push(getDateMonthFormat(new Date(time), isRTL));
  }
  return list;
};

export const compressEvents = (events: any) => {
  if (events && events.length > 0) {
    const event = events[0];
    const times = events.map((ev: any) => {
      return {
        startDate: ev.startDate,
        endDate: ev.endDate,
        status: ev.status,
      };
    });
    return JSON.stringify({ event, times });
  } else {
    return JSON.stringify([]);
  }
};

export const decompressEvents = (events: any) => {
  if (events) {
    const data = JSON.parse(events);
    const { event, times } = data;
    if (event && times) {
      const readyEvents = times.map((evt: any) => {
        return {
          ...event,
          startDate: evt.startDate,
          endDate: evt.endDate,
        };
      });
      return readyEvents;
    } else {
      return [];
    }
  }
};
