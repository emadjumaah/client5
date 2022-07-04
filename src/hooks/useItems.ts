/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { createItem, deleteItem, getItems, updateItem } from '../graphql';
import { getStoreItem } from '../store';

export default () => {
  const store = getStoreItem('store');
  const lang = store?.lang;
  const isRTL = lang === 'ar' ? true : false;
  const [getitms, itmData]: any = useLazyQuery(getItems, {
    variables: { isRTL },
  });

  const [addItem] = useMutation(createItem, {
    refetchQueries: [{ query: getItems, variables: { isRTL } }],
  });
  const [editItem] = useMutation(updateItem, {
    refetchQueries: [{ query: getItems, variables: { isRTL } }],
  });
  const [removeItem] = useMutation(deleteItem, {
    refetchQueries: [{ query: getItems, variables: { isRTL } }],
  });

  useEffect(() => {
    getitms();
  }, [getitms]);

  const items = itmData?.data?.['getItems']?.data || [];
  const refreshitem = () => itmData?.refetch();

  return { items, addItem, editItem, removeItem, refreshitem };
};
