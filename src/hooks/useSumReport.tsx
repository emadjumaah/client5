/* eslint-disable array-callback-return */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { getMonthlyReport } from "../graphql";

export default () => {
  const [freshSumData, sumData]: any = useLazyQuery(getMonthlyReport, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    freshSumData({});
  }, [freshSumData]);

  const rdata = sumData?.data?.["getMonthlyReport"]?.data;
  const data = rdata ? JSON.parse(rdata) : null;

  const refreshchart = () => sumData?.refetch();

  return {
    data,
    refreshchart,
    sumData,
  };
};
