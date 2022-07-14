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
export default () => {
  const [getsevs, itmData]: any = useLazyQuery(getExpenseItems);

  const [addExpenseItem] = useMutation(createItem, {
    refetchQueries: [{ query: getExpenseItems }],
  });
  const [addMultiExpenseItems] = useMutation(createMultiItems, {
    refetchQueries: [{ query: getExpenseItems }],
  });
  const [editExpenseItem] = useMutation(updateItem, {
    refetchQueries: [{ query: getExpenseItems }],
  });
  const [removeExpenseItem] = useMutation(deleteItem, {
    refetchQueries: [{ query: getExpenseItems }],
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
