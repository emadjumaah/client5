/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useLazyQuery } from "@apollo/client";
import { useEffect } from "react";

import getTasks from "../graphql/query/getTasks";

export default () => {
  const [getfins, finData] = useLazyQuery(getTasks, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    getfins();
  }, [getfins]);

  const baretasks = finData?.data?.["getTasks"]?.data || [];
  const tasks = baretasks.map((bt: any) => {
    return {
      ...bt,
      name: bt.title,
      nameAr: bt.title,
    };
  });

  return { tasks };
};
