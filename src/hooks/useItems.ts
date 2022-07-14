/* eslint-disable import/no-anonymous-default-export */
import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { createItem, deleteItem, getItems, updateItem } from '../graphql';

export default () => {
  const [getitms, itmData]: any = useLazyQuery(getItems);

  const [addItem] = useMutation(createItem, {
    refetchQueries: [{ query: getItems }],
  });
  const [editItem] = useMutation(updateItem, {
    refetchQueries: [{ query: getItems }],
  });
  const [removeItem] = useMutation(deleteItem, {
    refetchQueries: [{ query: getItems }],
  });

  useEffect(() => {
    getitms();
  }, [getitms]);

  const items = itmData?.data?.['getItems']?.data || [];
  const refreshitem = () => itmData?.refetch();

  return { items, addItem, editItem, removeItem, refreshitem };
};
