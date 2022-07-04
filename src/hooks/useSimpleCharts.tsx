/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { useLazyQuery } from '@apollo/client';
import _ from 'lodash';
import { useEffect } from 'react';

import { getSimpleChartsData } from '../graphql';
import { getDateFormat, getDateMonthFormat } from '../Shared/colorFormat';
import { getStoreItem } from '../store';

export default () => {
  const store = getStoreItem('store');
  const lang = store?.lang;
  const isRTL = lang === 'ar' ? true : false;
  const [freshChartsData, chartsData]: any = useLazyQuery(getSimpleChartsData);

  useEffect(() => {
    freshChartsData();
  }, [freshChartsData]);

  const rdata = chartsData?.data?.['getSimpleChartsData'];
  const accounts = rdata ? JSON.parse(rdata.accounts) : null;
  const events = rdata ? rdata.events : null;
  const sales = rdata ? rdata.sales : null;

  let salesMonths: any;
  let salesDays: any;
  let eventMonths: any;
  let eventDays: any;

  if (sales) {
    const mdata = _.groupBy(sales, 'month');
    const monthsKeys = Object.keys(mdata);
    const monthsSale = monthsKeys.map((month: any) => {
      const dfname = isRTL ? 'departmentNameAr' : 'departmentName';
      const efname = isRTL ? 'employeeNameAr' : 'employeeName';
      const departments = _(mdata[month])
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
        departments,
        employees,
        count,
        total,
        date: new Date(time),
      };
    });

    const daydata: any = _.groupBy(sales, 'date');
    const dayskeys = Object.keys(daydata);
    const daysSale = dayskeys.map((day: any) => {
      const dfname = isRTL ? 'departmentNameAr' : 'departmentName';
      const efname = isRTL ? 'employeeNameAr' : 'employeeName';
      const departments = _(daydata[day])
        .groupBy(dfname)
        .map((array, key) => ({
          name: key,
          count: _.sumBy(array, 'count'),
          amount: _.sumBy(array, 'amount'),
        }))
        .orderBy('name')
        .value();

      const employees = _(daydata[day])
        .groupBy(efname)
        .map((array, key) => ({
          name: key,
          count: _.sumBy(array, 'count'),
          amount: _.sumBy(array, 'amount'),
        }))
        .orderBy('name')
        .value();
      const time: any = daydata[day]?.[0]?.date;
      const total = _.sumBy(daydata[day], 'amount');
      const count = _.sumBy(daydata[day], 'count');

      const name = getDateFormat(time, isRTL);
      return {
        name,
        departments,
        employees,
        count,
        total,
        date: new Date(day),
      };
    });

    salesDays = _.orderBy(daysSale, ['date'], ['asc']);
    salesMonths = _.orderBy(monthsSale, ['date'], ['asc']);
  }
  if (events) {
    const mdata = _.groupBy(events, 'month');
    const monthsKeys = Object.keys(mdata);
    const dfname = isRTL ? 'departmentNameAr' : 'departmentName';
    const efname = isRTL ? 'employeeNameAr' : 'employeeName';
    const sfname = isRTL ? 'statusAr' : 'statusEn';

    const monthsEvent = monthsKeys.map((month: any) => {
      const departments = _(mdata[month])
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
        departments,
        employees,
        status,
        count,
        total,
        date: new Date(time),
      };
    });

    const daydata: any = _.groupBy(events, 'date');
    const dayskeys = Object.keys(daydata);
    const daysEvent = dayskeys.map((day: any) => {
      const departments = _(daydata[day])
        .groupBy(dfname)
        .map((array, key) => ({
          name: key,
          count: _.sumBy(array, 'count'),
          amount: _.sumBy(array, 'amount'),
        }))
        .orderBy('name')
        .value();

      const employees = _(daydata[day])
        .groupBy(efname)
        .map((array, key) => ({
          name: key,
          count: _.sumBy(array, 'count'),
          amount: _.sumBy(array, 'amount'),
        }))
        .orderBy('name')
        .value();

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
        departments,
        employees,
        status,
        count,
        total,
        date: new Date(day),
      };
    });

    eventDays = _.orderBy(daysEvent, ['date'], ['asc']);
    eventMonths = _.orderBy(monthsEvent, ['date'], ['asc']);
  }
  const refreshchart = () => chartsData?.refetch();
  return {
    sales: {
      days: salesDays,
      months: salesMonths,
    },
    events: {
      days: eventDays,
      months: eventMonths,
    },
    accounts,
    refreshchart,
    chartsData,
  };
};
