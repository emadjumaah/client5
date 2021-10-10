/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useLazyQuery, useMutation } from "@apollo/client";
import { useEffect } from "react";
import { createGroup, deleteGroup, getGroups, updateGroup } from "../graphql";
import { getStoreItem } from "../store";

export default () => {
  const store = getStoreItem("store");
  const { lang } = store;
  const isRTL = lang === "ar" ? true : false;
  const [getDeparts, catpData]: any = useLazyQuery(getGroups, {
    variables: { isRTL },
  });

  const [addGroup] = useMutation(createGroup, {
    refetchQueries: [{ query: getGroups, variables: { isRTL } }],
  });
  const [editGroup] = useMutation(updateGroup, {
    refetchQueries: [{ query: getGroups, variables: { isRTL } }],
  });
  const [removeGroup] = useMutation(deleteGroup, {
    refetchQueries: [{ query: getGroups, variables: { isRTL } }],
  });

  useEffect(() => {
    getDeparts();
  }, [getDeparts]);

  const groups = catpData?.data?.["getGroups"]?.data || [];
  const refreshgroups = () => catpData?.refetch();
  return { groups, addGroup, editGroup, removeGroup, refreshgroups };
};
