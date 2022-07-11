/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import {
  createDepartment,
  deleteDepartment,
  getDepartments,
  updateDepartment,
} from '../graphql';
import { getStoreItem } from '../store';

export default () => {
  const store = getStoreItem('store');
  const lang = store?.lang;
  const isRTL = lang === 'ar' ? true : false;
  const [getDeparts, depData]: any = useLazyQuery(getDepartments, {
    variables: { isRTL },
  });

  const [addDepartment] = useMutation(createDepartment, {
    refetchQueries: [{ query: getDepartments, variables: { isRTL } }],
  });
  const [editDepartment] = useMutation(updateDepartment, {
    refetchQueries: [{ query: getDepartments, variables: { isRTL } }],
  });
  const [removeDepartment] = useMutation(deleteDepartment, {
    refetchQueries: [{ query: getDepartments, variables: { isRTL } }],
  });

  useEffect(() => {
    getDeparts();
  }, [getDeparts]);

  const departments = depData?.data?.['getDepartments']?.data || [];
  const refreshdepartment = () => depData?.refetch();
  return {
    departments,
    refreshdepartment,
    addDepartment,
    editDepartment,
    removeDepartment,
  };
};
