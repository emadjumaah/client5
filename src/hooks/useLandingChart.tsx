/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { useLazyQuery } from '@apollo/client';
import _ from 'lodash';
import { useEffect } from 'react';
import { getLastDays, getLastMonths } from '../common/time';

import { getLandingChartData } from '../graphql';
import { getDateFormat, getDateMonthFormat } from '../Shared/colorFormat';
import { getStoreItem } from '../store';
import useDepartments from './useDepartments';

export default () => {
  const store = getStoreItem('store');
  const { lang } = store;
  const isRTL = lang === 'ar' ? true : false;

  const [freshChartData, chartData]: any = useLazyQuery(getLandingChartData);
  const { departments } = useDepartments();

  useEffect(() => {
    freshChartData();
  }, [freshChartData]);

  const data = chartData?.data?.['getLandingChartData']?.data;

  const refreshChartData = () => chartData?.refetch();

  let salesDays: any;
  let eventDays: any;
  let todaySales: any;
  let nextEventDays: any;

  let todayEvents: any;
  let salesTodayTotal: any;
  let eventsTodayCount: any;

  let salesMonths: any;
  let eventMonths: any;
  let salesMonth: any;
  let eventsMonth: any;
  let salesMonthTotal: any;
  let eventsMonthCount: any;

  let raseeds: any;

  const fname = isRTL ? 'nameAr' : 'name';
  const dfname = isRTL ? 'departmentNameAr' : 'departmentName';
  const efname = isRTL ? 'employeeNameAr' : 'employeeName';
  const sfname = isRTL ? 'statusAr' : 'statusEn';

  if (data) {
    const charts = JSON.parse(data);

    const {
      accounts,
      daysEvents,
      daysSales,
      monthsEvents,
      monthsSales,
      todayEventsData,
      todaySalesData,
    } = charts;

    raseeds = accounts;

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

      const spredstatus = _.mapValues(_.keyBy(status, 'name'), 'count');

      const time: any = daydata[day]?.[0]?.date;
      const total = _.sumBy(daydata[day], 'amount');
      const count = _.sumBy(daydata[day], 'count');

      const name = getDateFormat(new Date(time), isRTL);
      return {
        name,
        status,
        ...spredstatus,
        count,
        total,
        date: new Date(day),
      };
    });
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
    if (todaySalesData) {
      const mdata = _.groupBy(todaySalesData, dfname);
      const todayKeys = Object.keys(mdata);
      todaySales = todayKeys.map((dep: any) => {
        const value = _.sumBy(mdata[dep], 'amount');
        const color =
          departments && departments.length
            ? departments.filter((item: any) => item[fname] === dep)
            : null;
        return {
          name: dep,
          value,
          color: color ? color?.[0]?.color : '',
        };
      });
      salesTodayTotal = _.sumBy(todaySales, 'value');
    }
    if (todayEventsData) {
      eventsTodayCount = todayEventsData.length;
    }
    todayEvents = todayEventsData;
    if (monthsSales) {
      const mdata = _.groupBy(monthsSales, 'month');
      const monthsKeys = Object.keys(mdata);
      const monthsSale = monthsKeys.map((month: any) => {
        const departs = _(mdata[month])
          .groupBy(dfname)
          .map((array, key) => ({
            name: key,
            count: _.sumBy(array, 'count'),
            amount: _.sumBy(array, 'amount'),
          }))
          .orderBy('name')
          .value();

        const employees = _(mdata[month])
          .groupBy(efname)
          .map((array, key) => ({
            name: key,
            count: _.sumBy(array, 'count'),
            amount: _.sumBy(array, 'amount'),
            color: array[0].color,
          }))
          .orderBy('name')
          .value();
        const time: any = mdata[month]?.[0]?.date;
        const total = _.sumBy(mdata[month], 'amount');
        const count = _.sumBy(mdata[month], 'count');
        const name = getDateMonthFormat(time, isRTL);
        return {
          name,
          departments: departs,
          employees,
          count,
          total,
          date: new Date(time),
        };
      });

      const monthsList = getLastMonths(6, isRTL);
      salesMonths = monthsList.map((mon: any) => {
        const is = monthsSale.filter((ds: any) => ds.name === mon);
        if (is && is.length > 0) {
          return is[0];
        } else {
          return {
            name: mon,
            count: 0,
            total: 0,
          };
        }
      });
      const mname = getDateMonthFormat(new Date(), isRTL);
      salesMonth = salesMonths.filter((sm: any) => sm.name === mname)?.[0];
      salesMonthTotal = salesMonth?.total;
    }
    if (monthsEvents) {
      const mdata = _.groupBy(monthsEvents, 'month');
      const monthsKeys = Object.keys(mdata);

      const monthsEvent = monthsKeys.map((month: any) => {
        const departs = _(mdata[month])
          .groupBy(dfname)
          .map((array, key) => ({
            name: key,
            count: _.sumBy(array, 'count'),
            amount: _.sumBy(array, 'amount'),
          }))
          .orderBy('name')
          .value();

        const employees = _(mdata[month])
          .groupBy(efname)
          .map((array, key) => ({
            name: key,
            count: _.sumBy(array, 'count'),
            amount: _.sumBy(array, 'amount'),
          }))
          .orderBy('name')
          .value();
        const status = _(mdata[month])
          .groupBy(sfname)
          .map((array, key) => ({
            name: key,
            count: _.sumBy(array, 'count'),
            amount: _.sumBy(array, 'amount'),
          }))
          .orderBy('count')
          .value();
        const time: any = mdata[month]?.[0]?.date;
        const total = _.sumBy(mdata[month], 'amount');
        const count = _.sumBy(mdata[month], 'count');
        const name = getDateMonthFormat(time, isRTL);
        return {
          name,
          departments: departs,
          employees,
          status,
          count,
          total,
          date: new Date(time),
        };
      });

      const monthsList = getLastMonths(6, isRTL);

      eventMonths = monthsList.map((mon: any) => {
        const is = monthsEvent.filter((ds: any) => ds.name === mon);
        if (is && is.length > 0) {
          return is[0];
        } else {
          return {
            name: mon,
            count: 0,
            total: 0,
          };
        }
      });
      const mname = getDateMonthFormat(new Date(), isRTL);
      eventsMonth = eventMonths.filter((sm: any) => sm.name === mname)?.[0];
      eventsMonthCount = eventsMonth.count;
    }
  }
  return {
    salesDays,
    eventDays,
    nextEventDays,
    todaySales,
    todayEvents,
    salesTodayTotal,
    eventsTodayCount,
    salesMonths,
    eventMonths,
    salesMonth,
    eventsMonth,
    salesMonthTotal,
    eventsMonthCount,
    raseeds,
    refreshChartData,
  };
};
