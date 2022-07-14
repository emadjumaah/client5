/* eslint-disable import/no-anonymous-default-export */
import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import {
  createItem,
  deleteItem,
  getNoStockProducts,
  updateItem,
} from '../graphql';

export default () => {
  const [getprods, itmData]: any = useLazyQuery(getNoStockProducts);

  const [addnsProduct] = useMutation(createItem, {
    refetchQueries: [{ query: getNoStockProducts }],
  });
  const [editnsProduct] = useMutation(updateItem, {
    refetchQueries: [{ query: getNoStockProducts }],
  });
  const [removensProduct] = useMutation(deleteItem, {
    refetchQueries: [{ query: getNoStockProducts }],
  });

  useEffect(() => {
    getprods();
  }, [getprods]);

  const nsproducts = itmData?.data?.['getNoStockProducts']?.data || [];

  const refreshnsproduct = () => itmData?.refetch();

  return {
    nsproducts,
    addnsProduct,
    editnsProduct,
    refreshnsproduct,
    removensProduct,
  };
};
