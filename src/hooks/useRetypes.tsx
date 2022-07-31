/* eslint-disable import/no-anonymous-default-export */
import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import {
  createRetype,
  deleteRetype,
  getRetypes,
  updateRetype,
} from '../graphql';

export default () => {
  const [getRetys, depData]: any = useLazyQuery(getRetypes);
  const [addRetype] = useMutation(createRetype, {
    refetchQueries: [{ query: getRetypes }],
  });
  const [editRetype] = useMutation(updateRetype, {
    refetchQueries: [{ query: getRetypes }],
  });
  const [removeRetype] = useMutation(deleteRetype, {
    refetchQueries: [{ query: getRetypes }],
  });

  useEffect(() => {
    getRetys();
  }, [getRetys]);

  const retypes = depData?.data?.['getRetypes']?.data || [];
  const refreshretype = () => depData?.refetch();
  return {
    retypes,
    refreshretype,
    addRetype,
    editRetype,
    removeRetype,
    loading: depData?.loading,
  };
};
