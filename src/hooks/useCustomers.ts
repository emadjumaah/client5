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

export default () => {
  const [getCusts, custData]: any = useLazyQuery(getCustomers);

  const [addCustomer] = useMutation(createCustomer, {
    refetchQueries: [{ query: getCustomers }],
  });
  const [addMultiCustomers] = useMutation(createMultiCustomers, {
    refetchQueries: [{ query: getCustomers }],
  });
  const [editCustomer] = useMutation(updateCustomer, {
    refetchQueries: [{ query: getCustomers }],
  });
  const [removeCustomer] = useMutation(deleteCustomer, {
    refetchQueries: [{ query: getCustomers }],
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
