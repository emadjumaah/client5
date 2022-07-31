/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { createGroup, deleteGroup, getGroups, updateGroup } from '../graphql';

export default () => {
  const [getDeparts, catpData]: any = useLazyQuery(getGroups);

  const [addGroup] = useMutation(createGroup, {
    refetchQueries: [{ query: getGroups }],
  });
  const [editGroup] = useMutation(updateGroup, {
    refetchQueries: [{ query: getGroups }],
  });
  const [removeGroup] = useMutation(deleteGroup, {
    refetchQueries: [{ query: getGroups }],
  });

  useEffect(() => {
    getDeparts();
  }, [getDeparts]);

  const groups = catpData?.data?.['getGroups']?.data || [];
  const refreshgroups = () => catpData?.refetch();
  return {
    groups,
    addGroup,
    editGroup,
    removeGroup,
    refreshgroups,
    loading: catpData?.loading,
  };
};
