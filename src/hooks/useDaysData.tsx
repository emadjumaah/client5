/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { useLazyQuery } from '@apollo/client';
import _ from 'lodash';
import { useEffect } from 'react';
import { getLastDays } from '../common/time';

import { getDaysEvents, getDaysSales } from '../graphql';
import { getDateFormat } from '../Shared/colorFormat';
import { getStoreItem } from '../store';

export default () => {
  const store = getStoreItem('store');
  const lang = store?.lang;
  const isRTL = lang === 'ar' ? true : false;

  const [freshSalesData, salesData]: any = useLazyQuery(getDaysSales);
  const [freshEventsData, eventsData]: any = useLazyQuery(getDaysEvents);

  useEffect(() => {
    freshSalesData();
    freshEventsData();
  }, [freshSalesData, freshEventsData]);

  const daysSales = salesData?.data?.['getDaysSales']?.data;
  const daysEvents = eventsData?.data?.['getDaysEvents']?.data;

  const refreshDaysSales = () => salesData?.refetch();
  const refreshDaysEvents = () => eventsData?.refetch();

  let salesDays: any;
  let eventDays: any;
  let nextEventDays: any;

  if (daysSales) {
    const daysSale = daysSales.map((d: any) => {
      const { date, count, amount } = d;
      return {
        name: getDateFormat(new Date(date), isRTL),
        count,
        total: amount,
        date: new Date(date),
      };
    });

    const daysList = getLastDays(7, isRTL);
    salesDays = daysList.map((day: any) => {
      const is = daysSale.filter((ds: any) => ds.name === day);
      if (is && is.length > 0) {
        return is[0];
      } else {
        return {
          name: day,
          count: 0,
          total: 0,
        };
      }
    });
  }

  if (daysEvents) {
    const sfname = isRTL ? 'statusAr' : 'statusEn';

    const daydata: any = _.groupBy(daysEvents, 'date');
    const dayskeys = Object.keys(daydata);

    const daysEvent = dayskeys.map((day: any) => {
      const status = _(daydata[day])
        .groupBy(sfname)
        .map((array, key) => ({
          name: key,
          count: _.sumBy(array, 'count'),
          amount: _.sumBy(array, 'amount'),
        }))
        .orderBy('count')
        .value();

      const time: any = daydata[day]?.[0]?.date;
      const total = _.sumBy(daydata[day], 'amount');
      const count = _.sumBy(daydata[day], 'count');

      const name = getDateFormat(time, isRTL);
      return {
        name,
        status,
        count,
        total,
        date: new Date(day),
      };
    });

    const daysList = getLastDays(7, isRTL);
    eventDays = daysList.map((day: any) => {
      const is = daysEvent.filter((ds: any) => ds.name === day);
      if (is && is.length > 0) {
        return is[0];
      } else {
        return {
          name: day,
          count: 0,
          total: 0,
        };
      }
    });
    const nextdaysList = getLastDays(7, isRTL, 'mid');
    nextEventDays = nextdaysList.map((day: any) => {
      const is = daysEvent.filter((ds: any) => ds.name === day);
      if (is && is.length > 0) {
        return is[0];
      } else {
        return {
          name: day,
          count: 0,
          total: 0,
        };
      }
    });
  }
  return {
    salesDays,
    eventDays,
    nextEventDays,
    refreshDaysSales,
    refreshDaysEvents,
  };
};
