/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { createItem, deleteItem, getProducts, updateItem } from '../graphql';
import createMultiItems from '../graphql/mutation/createMultiItems';

export default () => {
  const [getprods, itmData]: any = useLazyQuery(getProducts);

  let stockItems = [];

  const [addProduct] = useMutation(createItem, {
    refetchQueries: [{ query: getProducts }],
  });
  const [addMultiProducts] = useMutation(createMultiItems, {
    refetchQueries: [{ query: getProducts }],
  });
  const [editProduct] = useMutation(updateItem, {
    refetchQueries: [{ query: getProducts }],
  });
  const [removeProduct] = useMutation(deleteItem, {
    refetchQueries: [{ query: getProducts }],
  });

  useEffect(() => {
    getprods();
  }, [getprods]);

  const products = itmData?.data?.['getProducts']?.data || [];
  if (products && products.length > 0) {
    stockItems = products.filter((pro: any) => pro.qty > 0);
  }

  const refreshproduct = () => itmData?.refetch();

  return {
    products,
    stockItems,
    addProduct,
    addMultiProducts,
    editProduct,
    refreshproduct,
    removeProduct,
    loading: itmData?.loading,
  };
};
