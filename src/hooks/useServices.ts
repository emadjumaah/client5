/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { createItem, deleteItem, getServices, updateItem } from '../graphql';
import createMultiItems from '../graphql/mutation/createMultiItems';
import { getStoreItem } from '../store';

export default () => {
  const store = getStoreItem('store');
  const lang = store?.lang;
  const isRTL = lang === 'ar' ? true : false;
  const [getsevs, itmData]: any = useLazyQuery(getServices, {
    variables: { isRTL },
    nextFetchPolicy: 'cache-and-network',
  });

  const [addService] = useMutation(createItem, {
    refetchQueries: [{ query: getServices, variables: { isRTL } }],
  });
  const [addMultiServices] = useMutation(createMultiItems, {
    refetchQueries: [{ query: getServices, variables: { isRTL } }],
  });
  const [editService] = useMutation(updateItem, {
    refetchQueries: [{ query: getServices, variables: { isRTL } }],
  });
  const [removeService] = useMutation(deleteItem, {
    refetchQueries: [{ query: getServices, variables: { isRTL } }],
  });

  useEffect(() => {
    getsevs();
  }, [getsevs]);

  const services = itmData?.data?.['getServices']?.data || [];
  const refreshservice = () => {
    itmData?.refetch();
  };

  return {
    services,
    addService,
    addMultiServices,
    editService,
    removeService,
    refreshservice,
  };
};
