/* eslint-disable no-shadow */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useLazyQuery } from "@apollo/client";
import _ from "lodash";
import { useEffect } from "react";
import { getTodaySales, getTodayEvents } from "../graphql";
import { getStoreItem } from "../store";
import useDepartments from "./useDepartments";

export default () => {
  const store = getStoreItem("store");
  const { lang } = store;
  const isRTL = lang === "ar" ? true : false;
  const { departments } = useDepartments();
  const [freshSalesData, salesData]: any = useLazyQuery(getTodaySales);
  const [freshEventsData, eventsData]: any = useLazyQuery(getTodayEvents);

  useEffect(() => {
    freshSalesData();
    freshEventsData();
  }, [freshSalesData, freshEventsData]);

  const todaySalesData = salesData?.data?.["getTodaySales"]?.data;
  const todayEvents = eventsData?.data?.["getTodayEvents"]?.data;

  let todaySales: any;
  let salesTodayTotal: any;
  let eventsTodayCount: any;

  if (todaySalesData) {
    const dfname = isRTL ? "departmentNameAr" : "departmentName";
    const fname = isRTL ? "nameAr" : "name";
    const mdata = _.groupBy(todaySalesData, dfname);
    const todayKeys = Object.keys(mdata);
    todaySales = todayKeys.map((dep: any) => {
      const value = _.sumBy(mdata[dep], "amount");
      const color =
        departments && departments.length
          ? departments.filter((item: any) => item[fname] === dep)
          : null;
      return {
        name: dep,
        value,
        color: color ? color?.[0]?.color : "",
      };
    });
    salesTodayTotal = _.sumBy(todaySales, "value");
  }
  if (todayEvents) {
    eventsTodayCount = todayEvents.length;
  }

  const refreshTodaySales = () => salesData?.refetch();
  const refreshTodayEvents = () => eventsData?.refetch();

  return {
    todaySales,
    todayEvents,
    salesTodayTotal,
    eventsTodayCount,
    refreshTodaySales,
    refreshTodayEvents,
  };
};
