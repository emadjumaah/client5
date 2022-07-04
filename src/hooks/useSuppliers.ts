/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import {
  getSuppliers,
  createSupplier,
  deleteSupplier,
  updateSupplier,
} from '../graphql';
import { getStoreItem } from '../store';

export default () => {
  const store = getStoreItem('store');
  const lang = store?.lang;
  const isRTL = lang === 'ar' ? true : false;
  const [getCusts, custData]: any = useLazyQuery(getSuppliers, {
    variables: { isRTL },
  });

  const [addSupplier] = useMutation(createSupplier, {
    refetchQueries: [{ query: getSuppliers, variables: { isRTL } }],
  });
  const [editSupplier] = useMutation(updateSupplier, {
    refetchQueries: [{ query: getSuppliers, variables: { isRTL } }],
  });
  const [removeSupplier] = useMutation(deleteSupplier, {
    refetchQueries: [{ query: getSuppliers, variables: { isRTL } }],
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
