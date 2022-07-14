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

export default () => {
  const [getemparts, empData]: any = useLazyQuery(getResourses);

  const [addResourse] = useMutation(createResourse, {
    refetchQueries: [{ query: getResourses }],
  });
  const [editResourse] = useMutation(updateResourse, {
    refetchQueries: [{ query: getResourses }],
  });
  const [removeResourse] = useMutation(deleteResourse, {
    refetchQueries: [{ query: getResourses }],
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
