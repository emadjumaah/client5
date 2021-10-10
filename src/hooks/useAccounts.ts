/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useLazyQuery, useMutation } from "@apollo/client";
import { useEffect } from "react";
import {
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from "../graphql";

export default () => {
  const [getAccs, accData]: any = useLazyQuery(getAccounts);

  const [addAccount] = useMutation(createAccount, {
    refetchQueries: [{ query: getAccounts }],
  });
  const [editAccount] = useMutation(updateAccount, {
    refetchQueries: [{ query: getAccounts }],
  });
  const [removeAccount] = useMutation(deleteAccount, {
    refetchQueries: [{ query: getAccounts }],
  });

  useEffect(() => {
    getAccs();
  }, [getAccs]);

  const accounts = accData?.data?.["getAccounts"]?.data || [];
  const filterd =
    accounts?.length > 0
      ? accounts.filter((acc: any) =>
          [1, 2, 3, 7, 8, 13, 14, 15].includes(acc.parentcode),
        )
      : [];
  filterd.sort((a: any, b: any) => a.code - b.code);
  const refreshAccount = () => accData?.refetch();

  return {
    accounts,
    filterd,
    refreshAccount,
    addAccount,
    editAccount,
    removeAccount,
  };
};
