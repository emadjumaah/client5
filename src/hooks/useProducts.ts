/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useLazyQuery, useMutation } from "@apollo/client";
import { useEffect } from "react";
import {
  createItem,
  deleteItem,
  getItems,
  getProducts,
  updateItem,
} from "../graphql";
import { getStoreItem } from "../store";

export default () => {
  const store = getStoreItem("store");
  const { lang } = store;
  const isRTL = lang === "ar" ? true : false;
  const [getprods, itmData]: any = useLazyQuery(getProducts, {
    variables: { isRTL },
  });

  let stockItems = [];

  const [addProduct] = useMutation(createItem, {
    refetchQueries: [
      { query: getProducts, variables: { isRTL } },
      { query: getItems, variables: { isRTL } },
    ],
  });
  const [editProduct] = useMutation(updateItem, {
    refetchQueries: [
      { query: getProducts, variables: { isRTL } },
      { query: getItems, variables: { isRTL } },
    ],
  });
  const [removeProduct] = useMutation(deleteItem, {
    refetchQueries: [
      { query: getProducts, variables: { isRTL } },
      { query: getItems, variables: { isRTL } },
    ],
  });

  useEffect(() => {
    getprods();
  }, [getprods]);

  const products = itmData?.data?.["getProducts"]?.data || [];
  if (products && products.length > 0) {
    stockItems = products.filter((pro: any) => pro.qty > 0);
  }

  const refreshproduct = () => itmData?.refetch();

  return {
    products,
    stockItems,
    addProduct,
    editProduct,
    refreshproduct,
    removeProduct,
  };
};