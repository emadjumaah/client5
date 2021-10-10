/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useLazyQuery } from "@apollo/client";
import _ from "lodash";
import { useEffect } from "react";
import { groupBy } from "../common";
import { eventStatus } from "../constants";
import { accountType } from "../constants/kaid";
import { getChartsData } from "../graphql";
import useDepartments from "./useDepartments";
import useEmployees from "./useEmployees";

export default () => {
  const [freshChartsData, chartsData]: any = useLazyQuery(getChartsData);
  const { departments } = useDepartments();
  const { employees } = useEmployees();

  useEffect(() => {
    freshChartsData();
  }, [freshChartsData]);

  let salesDepartment: any;
  let salesEmployee: any;
  let eventsDepartment: any;
  let eventsEmployee: any;
  let accounts: any;
  let closing: any;
  const raseedsData: any = {};

  const rdata = chartsData?.data?.["getChartsData"]?.data;
  const charts = rdata ? JSON.parse(rdata) : null;

  if (charts) {
    salesDepartment = charts?.sales?.department.map((cs: any) => {
      const dep = departments.filter(
        (de: any) => de._id === cs._id.department,
      )?.[0];
      const departmentName = dep?.name;
      const departmentNameAr = dep?.nameAr;
      const departmenColor = dep?.color;
      return {
        ...cs,
        amount: cs.credit - cs.debit,
        departmentName: departmentName ? departmentName : "Not available",
        departmentNameAr: departmentNameAr ? departmentNameAr : "غير متوفر",
        departmenColor,
        month: cs._id.month,
        year: cs._id.year,
        date: `${cs._id.month}-${cs._id.year}`,
      };
    });
    salesDepartment = groupBy(salesDepartment, "date");

    salesEmployee = charts?.sales?.employee.map((cs: any) => {
      const emp = employees.filter(
        (de: any) => de._id === cs._id.employee,
      )?.[0];
      const employeeName = emp?.name;
      const employeeNameAr = emp?.nameAr;
      const employeeColor = emp?.color;
      return {
        ...cs,
        amount: cs.credit - cs.debit,
        employeeName: employeeName ? employeeName : "Not available",
        employeeNameAr: employeeNameAr ? employeeNameAr : "غير متوفر",
        employeeColor,
        month: cs._id.month,
        year: cs._id.year,
        date: `${cs._id.month}-${cs._id.year}`,
      };
    });
    salesEmployee = groupBy(salesEmployee, "date");
    eventsDepartment = charts?.events?.department.map((ce: any) => {
      const dep = departments.filter(
        (de: any) => de._id === ce._id.department,
      )?.[0];
      const status = eventStatus.filter(
        (st: any) => st.id === ce._id.status,
      )?.[0];
      const departmentName = dep?.name;
      const departmentNameAr = dep?.nameAr;
      const departmenColor = dep?.color;
      const statusEn = status?.name;
      const statusAr = status?.nameAr;
      return {
        ...ce,
        departmentName: departmentName ? departmentName : "Not available",
        departmentNameAr: departmentNameAr ? departmentNameAr : "غير متوفر",
        departmenColor,
        statusEn,
        statusAr,
        month: ce._id.month,
        year: ce._id.year,
        date: `${ce._id.month}-${ce._id.year}`,
      };
    });

    eventsDepartment = groupBy(eventsDepartment, "date");

    eventsEmployee = charts?.events?.employee.map((ce: any) => {
      const emp = employees.filter(
        (de: any) => de._id === ce._id.employee,
      )?.[0];
      const status = eventStatus.filter(
        (st: any) => st.id === ce._id.status,
      )?.[0];
      const employeeName = emp?.name;
      const employeeNameAr = emp?.nameAr;
      const employeeColor = emp?.color;
      const statusEn = status?.name;
      const statusAr = status?.nameAr;
      return {
        ...ce,
        employeeName: employeeName ? employeeName : "Not available",
        employeeNameAr: employeeNameAr ? employeeNameAr : "غير متوفر",
        employeeColor,
        statusEn,
        statusAr,
        month: ce._id.month,
        year: ce._id.year,
        date: `${ce._id.month}-${ce._id.year}`,
      };
    });

    eventsEmployee = groupBy(eventsEmployee, "date");

    closing = charts?.accounts?.lastYearClosing?.data;

    accounts = charts?.accounts?.raseeds.map((acc: any) => {
      const code = acc._id.code;

      const acct = charts?.accounts?.accs.filter((ac: any) => ac.code === code);
      const account = acct?.[0];

      return {
        ...acc,
        amount:
          account.accType === accountType.CREDIT
            ? acc.credit - acc.debit
            : acc.debit - acc.credit,
        code: acc._id.code,
        ...account,
      };
    });

    accounts.map((accinfo: any) => {
      if (accinfo.code === 1000) {
        raseedsData.cash = accinfo.amount;
      }
      if (accinfo.code === 1010) {
        raseedsData.card = accinfo.amount;
      }
      if (accinfo.code === 1020) {
        raseedsData.bank = accinfo.amount;
      }
      if (accinfo.code === 4000) {
        raseedsData.income = accinfo.amount;
      }
    });
    if (closing && closing.length > 0) {
      closing.map((cl: any) => {
        if (cl.accCode === 1000) {
          raseedsData.cash = raseedsData.cash + cl.endBalance;
        }
        if (cl.accCode === 1010) {
          raseedsData.card = raseedsData.card + cl.endBalance;
        }
        if (cl.accCode === 1020) {
          raseedsData.bank = raseedsData.bank + cl.endBalance;
        }
        if (cl.accCode === 4000) {
          raseedsData.income = raseedsData.income + cl.endBalance;
        }
      });
    }
  }

  const refreshchart = () => chartsData?.refetch();

  return {
    salesDepartment,
    salesEmployee,
    eventsDepartment,
    eventsEmployee,
    raseedsData,
    refreshchart,
    chartsData,
  };
};
