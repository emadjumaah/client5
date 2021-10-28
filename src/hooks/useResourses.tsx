/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import {
  getResourses,
  createResourse,
  deleteResourse,
  updateResourse,
} from '../graphql';
import { getStoreItem } from '../store';

export default () => {
  const store = getStoreItem('store');
  const { lang } = store;
  const isRTL = lang === 'ar' ? true : false;
  const [getemparts, empData]: any = useLazyQuery(getResourses, {
    variables: { isRTL },
  });

  const [addResourse] = useMutation(createResourse, {
    refetchQueries: [{ query: getResourses, variables: { isRTL } }],
  });
  const [editResourse] = useMutation(updateResourse, {
    refetchQueries: [{ query: getResourses, variables: { isRTL } }],
  });
  const [removeResourse] = useMutation(deleteResourse, {
    refetchQueries: [{ query: getResourses, variables: { isRTL } }],
  });

  useEffect(() => {
    getemparts();
  }, [getemparts]);

  const resourses = empData?.data?.['getResourses']?.data || [];
  const refreshresourse = () => empData?.refetch();

  return {
    resourses,
    refreshresourse,
    addResourse,
    editResourse,
    removeResourse,
  };
};
