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

export default () => {
  const [getemparts, empData]: any = useLazyQuery(getEmployees);

  const [addEmployee] = useMutation(createEmployee, {
    refetchQueries: [{ query: getEmployees }],
  });
  const [editEmployee] = useMutation(updateEmployee, {
    refetchQueries: [{ query: getEmployees }],
  });
  const [removeEmployee] = useMutation(deleteEmployee, {
    refetchQueries: [{ query: getEmployees }],
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
