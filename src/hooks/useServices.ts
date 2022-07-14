/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { createItem, deleteItem, getServices, updateItem } from '../graphql';
import createMultiItems from '../graphql/mutation/createMultiItems';

export default () => {
  const [getsevs, itmData]: any = useLazyQuery(getServices);

  const [addService] = useMutation(createItem, {
    refetchQueries: [{ query: getServices }],
  });
  const [addMultiServices] = useMutation(createMultiItems, {
    refetchQueries: [{ query: getServices }],
  });
  const [editService] = useMutation(updateItem, {
    refetchQueries: [{ query: getServices }],
  });
  const [removeService] = useMutation(deleteItem, {
    refetchQueries: [{ query: getServices }],
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
