/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
} from '../graphql';
import { getStoreItem } from '../store';

export default () => {
  const store = getStoreItem('store');
  const lang = store?.lang;
  const isRTL = lang === 'ar' ? true : false;
  const [getemparts, empData]: any = useLazyQuery(getEmployees, {
    variables: { isRTL, resType: 1 },
  });

  const [addEmployee] = useMutation(createEmployee, {
    refetchQueries: [{ query: getEmployees, variables: { isRTL, resType: 1 } }],
  });
  const [editEmployee] = useMutation(updateEmployee, {
    refetchQueries: [{ query: getEmployees, variables: { isRTL, resType: 1 } }],
  });
  const [removeEmployee] = useMutation(deleteEmployee, {
    refetchQueries: [{ query: getEmployees, variables: { isRTL, resType: 1 } }],
  });

  useEffect(() => {
    getemparts();
  }, [getemparts]);

  const employees = empData?.data?.['getEmployees']?.data || [];
  const refreshemployee = () => empData?.refetch();

  return {
    employees,
    refreshemployee,
    addEmployee,
    editEmployee,
    removeEmployee,
  };
};
