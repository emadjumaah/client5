/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import {
  createResourse,
  deleteResourse,
  getResourses,
  updateResourse,
} from '../graphql';
import { getStoreItem } from '../store';

export default () => {
  const store = getStoreItem('store');
  const lang = store?.lang;
  const isRTL = lang === 'ar' ? true : false;
  const [getemparts, empData]: any = useLazyQuery(getResourses, {
    variables: { isRTL, resType: 2 },
  });

  const [addResourse] = useMutation(createResourse, {
    refetchQueries: [{ query: getResourses, variables: { isRTL, resType: 2 } }],
  });
  const [editResourse] = useMutation(updateResourse, {
    refetchQueries: [{ query: getResourses, variables: { isRTL, resType: 2 } }],
  });
  const [removeResourse] = useMutation(deleteResourse, {
    refetchQueries: [{ query: getResourses, variables: { isRTL, resType: 2 } }],
  });

  useEffect(() => {
    getemparts();
  }, [getemparts]);

  const resourses = empData?.data?.['getResourses']?.data || [];
  const refreshresourses = () => empData?.refetch();

  return {
    resourses,
    refreshresourses,
    addResourse,
    editResourse,
    removeResourse,
  };
};
