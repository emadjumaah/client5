/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useLazyQuery, useMutation } from "@apollo/client";
import { useEffect } from "react";
import { getBranches, updateBranch } from "../graphql";

export default () => {
  const [getbras, branchData] = useLazyQuery(getBranches);

  const [editBranch] = useMutation(updateBranch, {
    refetchQueries: [{ query: getBranches }],
  });

  useEffect(() => {
    getbras();
  }, [getbras]);

  const branches = branchData?.data?.["getBranches"]?.data || [];

  return { branches, editBranch };
};
