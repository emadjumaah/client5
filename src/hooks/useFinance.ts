/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useLazyQuery, useMutation } from "@apollo/client";
import { useEffect } from "react";
import {
  createFinance,
  deleteFinance,
  getFinances,
  updateFinance,
} from "../graphql";

export default () => {
  const [getfins, finData] = useLazyQuery(getFinances, {
    fetchPolicy: "cache-and-network",
  });

  const [addFinance] = useMutation(createFinance, {
    refetchQueries: [{ query: getFinances }],
  });
  const [editFinance] = useMutation(updateFinance, {
    refetchQueries: [{ query: getFinances }],
  });
  const [removeFinance] = useMutation(deleteFinance, {
    refetchQueries: [{ query: getFinances }],
  });

  useEffect(() => {
    getfins();
  }, [getfins]);

  const finances = finData?.data?.["getFinances"]?.data || [];

  return { finances, addFinance, editFinance, removeFinance };
};
