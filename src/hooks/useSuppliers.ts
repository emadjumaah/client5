/* eslint-disable import/no-anonymous-default-export */
import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import {
  getSuppliers,
  createSupplier,
  deleteSupplier,
  updateSupplier,
} from '../graphql';

export default () => {
  const [getCusts, custData]: any = useLazyQuery(getSuppliers);

  const [addSupplier] = useMutation(createSupplier, {
    refetchQueries: [{ query: getSuppliers }],
  });
  const [editSupplier] = useMutation(updateSupplier, {
    refetchQueries: [{ query: getSuppliers }],
  });
  const [removeSupplier] = useMutation(deleteSupplier, {
    refetchQueries: [{ query: getSuppliers }],
  });

  useEffect(() => {
    getCusts();
  }, [getCusts]);

  const suppliers = custData?.data?.['getSuppliers']?.data || [];
  const refreshsupplier = () => custData?.refetch();
  return {
    suppliers,
    refreshsupplier,
    addSupplier,
    editSupplier,
    removeSupplier,
  };
};
