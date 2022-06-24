/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import {
  createItem,
  deleteItem,
  getExpenseItems,
  updateItem,
} from '../graphql';
import createMultiItems from '../graphql/mutation/createMultiItems';
import { getStoreItem } from '../store';

export default () => {
  const store = getStoreItem('store');
  const { lang } = store;
  const isRTL = lang === 'ar' ? true : false;
  const [getsevs, itmData]: any = useLazyQuery(getExpenseItems, {
    variables: { isRTL },
    fetchPolicy: 'cache-and-network',
  });

  const [addExpenseItem] = useMutation(createItem, {
    refetchQueries: [{ query: getExpenseItems, variables: { isRTL } }],
  });
  const [addMultiExpenseItems] = useMutation(createMultiItems, {
    refetchQueries: [{ query: getExpenseItems, variables: { isRTL } }],
  });
  const [editExpenseItem] = useMutation(updateItem, {
    refetchQueries: [{ query: getExpenseItems, variables: { isRTL } }],
  });
  const [removeExpenseItem] = useMutation(deleteItem, {
    refetchQueries: [{ query: getExpenseItems, variables: { isRTL } }],
  });

  useEffect(() => {
    getsevs();
  }, [getsevs]);

  const expenseItems = itmData?.data?.['getExpenseItems']?.data || [];
  const refreshservice = () => itmData?.refetch();

  return {
    expenseItems,
    addExpenseItem,
    addMultiExpenseItems,
    editExpenseItem,
    removeExpenseItem,
    refreshservice,
  };
};
