/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import {
  createItem,
  deleteItem,
  getExpenseItems,
  getServices,
  updateItem,
} from '../graphql';
import createMultiItems from '../graphql/mutation/createMultiItems';
import { getStoreItem } from '../store';

export default () => {
  const store = getStoreItem('store');
  const { lang } = store;
  const isRTL = lang === 'ar' ? true : false;
  const [getsevs, itmData]: any = useLazyQuery(getServices, {
    variables: { isRTL },
  });
  const [getexpns, expnsData]: any = useLazyQuery(getExpenseItems, {
    variables: { isRTL },
  });

  const [addService] = useMutation(createItem, {
    refetchQueries: [
      { query: getServices, variables: { isRTL } },
      { query: getExpenseItems, variables: { isRTL } },
    ],
  });
  const [addMultiServices] = useMutation(createMultiItems, {
    refetchQueries: [
      { query: getServices, variables: { isRTL } },
      { query: getExpenseItems, variables: { isRTL } },
    ],
  });
  const [editService] = useMutation(updateItem, {
    refetchQueries: [
      { query: getServices, variables: { isRTL } },
      { query: getExpenseItems, variables: { isRTL } },
    ],
  });
  const [removeService] = useMutation(deleteItem, {
    refetchQueries: [
      { query: getServices, variables: { isRTL } },
      { query: getExpenseItems, variables: { isRTL } },
    ],
  });

  useEffect(() => {
    getsevs();
    getexpns();
  }, [getsevs]);

  const services = itmData?.data?.['getServices']?.data || [];
  const expenseitems = expnsData?.data?.['getExpenseItems']?.data || [];
  const refreshservice = () => {
    itmData?.refetch();
    expnsData?.refetch();
  };

  return {
    services,
    expenseitems,
    addService,
    addMultiServices,
    editService,
    removeService,
    refreshservice,
  };
};
