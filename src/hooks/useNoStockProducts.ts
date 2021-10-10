/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useLazyQuery, useMutation } from "@apollo/client";
import { useEffect } from "react";
import {
  createItem,
  deleteItem,
  getItems,
  getNoStockProducts,
  updateItem,
} from "../graphql";
import { getStoreItem } from "../store";

export default () => {
  const store = getStoreItem("store");
  const { lang } = store;
  const isRTL = lang === "ar" ? true : false;
  const [getprods, itmData]: any = useLazyQuery(getNoStockProducts, {
    variables: { isRTL },
  });

  const [addnsProduct] = useMutation(createItem, {
    refetchQueries: [
      { query: getNoStockProducts, variables: { isRTL } },
      { query: getItems, variables: { isRTL } },
    ],
  });
  const [editnsProduct] = useMutation(updateItem, {
    refetchQueries: [
      { query: getNoStockProducts, variables: { isRTL } },
      { query: getItems, variables: { isRTL } },
    ],
  });
  const [removensProduct] = useMutation(deleteItem, {
    refetchQueries: [
      { query: getNoStockProducts, variables: { isRTL } },
      { query: getItems, variables: { isRTL } },
    ],
  });

  useEffect(() => {
    getprods();
  }, [getprods]);

  const nsproducts = itmData?.data?.["getNoStockProducts"]?.data || [];

  const refreshnsproduct = () => itmData?.refetch();

  return {
    nsproducts,
    addnsProduct,
    editnsProduct,
    refreshnsproduct,
    removensProduct,
  };
};
