/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  updateCustomer,
} from '../graphql';
import createMultiCustomers from '../graphql/mutation/createMultiCustomers';
import { getStoreItem } from '../store';

export default () => {
  const store = getStoreItem('store');
  const lang = store?.lang;
  const isRTL = lang === 'ar' ? true : false;
  const [getCusts, custData]: any = useLazyQuery(getCustomers, {
    variables: { isRTL },
  });

  const [addCustomer] = useMutation(createCustomer, {
    refetchQueries: [{ query: getCustomers, variables: { isRTL } }],
  });
  const [addMultiCustomers] = useMutation(createMultiCustomers, {
    refetchQueries: [{ query: getCustomers, variables: { isRTL } }],
  });
  const [editCustomer] = useMutation(updateCustomer, {
    refetchQueries: [{ query: getCustomers, variables: { isRTL } }],
  });
  const [removeCustomer] = useMutation(deleteCustomer, {
    refetchQueries: [{ query: getCustomers, variables: { isRTL } }],
  });

  useEffect(() => {
    getCusts();
  }, [getCusts]);

  const customers = custData?.data?.['getCustomers']?.data || [];
  const refreshcustomer = () => custData?.refetch();
  return {
    customers,
    refreshcustomer,
    addCustomer,
    addMultiCustomers,
    editCustomer,
    removeCustomer,
  };
};
