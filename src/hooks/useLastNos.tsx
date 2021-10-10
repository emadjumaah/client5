/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useLazyQuery } from "@apollo/client";
import { useEffect } from "react";
import { getLastNos } from "../graphql";
import { lastNoTypes } from "../languages/langTypes";

export default () => {
  const [freshlastNos, invNopData] = useLazyQuery(getLastNos, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    freshlastNos();
  }, [freshlastNos]);

  const lastNosdata = invNopData?.data?.["getLastNos"]?.data;
  const numbers = lastNosdata ? JSON.parse(lastNosdata) : [];

  const lastNos: lastNoTypes | any = {};
  if (numbers.length > 0) {
    numbers.map((no: any) => {
      lastNos[no._id] = no.sequenceValue;
    });
  }
  return { lastNos, freshlastNos };
};
