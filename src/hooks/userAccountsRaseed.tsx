/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable import/no-anonymous-default-export */

import { useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { getAccountsRaseed } from "../graphql";

export default () => {
  const [freshAccData, accData]: any = useLazyQuery(getAccountsRaseed);

  useEffect(() => {
    freshAccData({});
  }, [freshAccData]);

  const rdata = accData?.data?.["getAccountsRaseed"]?.data;
  const raseeds = rdata ? JSON.parse(rdata) : null;

  const refreshraseeds = () => accData?.refetch();

  return {
    raseeds,
    refreshraseeds,
  };
};
