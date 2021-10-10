/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { useLazyQuery } from "@apollo/client";
import _ from "lodash";
import { useEffect } from "react";
import { getLastMonths } from "../common/time";

import { getMonthsSales, getMonthsEvents } from "../graphql";
import { getDateMonthFormat } from "../Shared/colorFormat";
import { getStoreItem } from "../store";

export default () => {
  const store = getStoreItem("store");
  const { lang } = store;
  const isRTL = lang === "ar" ? true : false;

  const [freshSalesData, salesData]: any = useLazyQuery(getMonthsSales);
  const [freshEventsData, eventsData]: any = useLazyQuery(getMonthsEvents);

  useEffect(() => {
    freshSalesData();
    freshEventsData();
  }, [freshSalesData, freshEventsData]);

  const monthsSales = salesData?.data?.["getMonthsSales"]?.data;
  const monthsEvents = eventsData?.data?.["getMonthsEvents"]?.data;

  const refreshMonthsSales = () => salesData?.refetch();
  const refreshMonthsEvents = () => eventsData?.refetch();

  let salesMonths: any;
  let eventMonths: any;
  let salesMonth: any;
  let eventsMonth: any;
  let salesMonthTotal: any;
  let eventsMonthCount: any;

  if (monthsSales) {
    const dfname = isRTL ? "departmentNameAr" : "departmentName";
    const efname = isRTL ? "employeeNameAr" : "employeeName";
    const mdata = _.groupBy(monthsSales, "month");
    const monthsKeys = Object.keys(mdata);
    const monthsSale = monthsKeys.map((month: any) => {
      const departments = _(mdata[month])
        .groupBy(dfname)
        .map((array, key) => ({
          name: key,
          count: _.sumBy(array, "count"),
          amount: _.sumBy(array, "amount"),
        }))
        .orderBy("name")
        .value();

      const employees = _(mdata[month])
        .groupBy(efname)
        .map((array, key) => ({
          name: key,
          count: _.sumBy(array, "count"),
          amount: _.sumBy(array, "amount"),
          color: array[0].color,
        }))
        .orderBy("name")
        .value();
      const time: any = mdata[month]?.[0]?.date;
      const total = _.sumBy(mdata[month], "amount");
      const count = _.sumBy(mdata[month], "count");
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

    const monthsList = getLastMonths(5, isRTL);
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

    salesMonth = salesMonths[salesMonths.length - 1];
    salesMonthTotal = salesMonth?.total;
  }
  if (monthsEvents) {
    const mdata = _.groupBy(monthsEvents, "month");
    const monthsKeys = Object.keys(mdata);
    const dfname = isRTL ? "departmentNameAr" : "departmentName";
    const efname = isRTL ? "employeeNameAr" : "employeeName";
    const sfname = isRTL ? "statusAr" : "statusEn";

    const monthsEvent = monthsKeys.map((month: any) => {
      const departments = _(mdata[month])
        .groupBy(dfname)
        .map((array, key) => ({
          name: key,
          count: _.sumBy(array, "count"),
          amount: _.sumBy(array, "amount"),
        }))
        .orderBy("name")
        .value();

      const employees = _(mdata[month])
        .groupBy(efname)
        .map((array, key) => ({
          name: key,
          count: _.sumBy(array, "count"),
          amount: _.sumBy(array, "amount"),
        }))
        .orderBy("name")
        .value();
      const status = _(mdata[month])
        .groupBy(sfname)
        .map((array, key) => ({
          name: key,
          count: _.sumBy(array, "count"),
          amount: _.sumBy(array, "amount"),
        }))
        .orderBy("count")
        .value();
      const time: any = mdata[month]?.[0]?.date;
      const total = _.sumBy(mdata[month], "amount");
      const count = _.sumBy(mdata[month], "count");
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

    const monthsList = getLastMonths(5, isRTL);
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
    eventsMonth = eventMonths[eventMonths.length - 1];
    eventsMonthCount = eventsMonth.count;
  }

  return {
    salesMonths,
    eventMonths,
    refreshMonthsSales,
    refreshMonthsEvents,
    salesMonth,
    salesMonthTotal,
    eventsMonthCount,
  };
};
