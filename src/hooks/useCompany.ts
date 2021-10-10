/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable import/no-anonymous-default-export */

import { useLazyQuery, useMutation } from "@apollo/client";
import { useEffect } from "react";
import { getCompany, updateCompany } from "../graphql";

export default () => {
  const [getComp, compData]: any = useLazyQuery(getCompany);

  const [editCompany] = useMutation(updateCompany, {
    refetchQueries: [{ query: getCompany }],
  });

  useEffect(() => {
    getComp();
  }, [getComp]);

  let company: any;
  const comp1 = compData?.data?.["getCompany"]?.data || null;
  if (comp1) {
    company = JSON.parse(comp1);
  }
  const refreshcompany = () => compData?.refetch();

  return { company, editCompany, refreshcompany };
};
