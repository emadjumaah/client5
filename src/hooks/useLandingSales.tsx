/* eslint-disable import/no-anonymous-default-export */

import { useLazyQuery } from '@apollo/client';
import _ from 'lodash';
import { useEffect } from 'react';
import { getLastMonths } from '../common/time';

import getLandingChartSales from '../graphql/query/getLandingChartSales';
import { getDateMonthFormat } from '../Shared/colorFormat';
import { getStoreItem } from '../store';

export default () => {
  const store = getStoreItem('store');
  const lang = store?.lang;
  const isRTL = lang === 'ar' ? true : false;

  const [freshChartData, chartData]: any = useLazyQuery(getLandingChartSales, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    freshChartData();
  }, [freshChartData]);

  const data = chartData?.data?.['getLandingChartSales']?.data;

  const refreshSalesData = () => chartData?.refetch();

  let salesMonths: any;
  let salesMonth: any;
  let salesMonthTotal: any;

  let raseeds: any;

  const dfname = isRTL ? 'departmentNameAr' : 'departmentName';
  const efname = isRTL ? 'employeeNameAr' : 'employeeName';

  if (data) {
    const charts = JSON.parse(data);

    const { accounts, monthsSales } = charts;
    raseeds = accounts;

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
  }
  return {
    salesMonths,
    salesMonth,
    salesMonthTotal,
    raseeds,
    refreshSalesData,
  };
};
