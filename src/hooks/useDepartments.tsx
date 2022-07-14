/* eslint-disable import/no-anonymous-default-export */
import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import {
  createDepartment,
  deleteDepartment,
  getDepartments,
  updateDepartment,
} from '../graphql';

export default () => {
  const [getDeparts, depData]: any = useLazyQuery(getDepartments);

  const [addDepartment] = useMutation(createDepartment, {
    refetchQueries: [{ query: getDepartments }],
  });
  const [editDepartment] = useMutation(updateDepartment, {
    refetchQueries: [{ query: getDepartments }],
  });
  const [removeDepartment] = useMutation(deleteDepartment, {
    refetchQueries: [{ query: getDepartments }],
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
