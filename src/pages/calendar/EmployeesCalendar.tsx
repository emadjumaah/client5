import React from 'react';
import { useEffect, useState } from 'react';
import { useCustomers } from '../../hooks';
import useDepartmentsUp from '../../hooks/useDepartmentsUp';
import useEmployeesUp from '../../hooks/useEmployeesUp';
import EmployeesAppoints from './Employees';

const EmployeesCalendar = (props: any) => {
  const [state, setstate] = useState([]);
  const { employees } = useEmployeesUp();
  const { departments } = useDepartmentsUp();
  const { customers } = useCustomers();

  useEffect(() => {
    if (employees && employees.length > 0) {
      const emps = employees.filter((em: any) => em.resType === 1);
      setstate(emps);
    }
  }, [employees]);

  return (
    <EmployeesAppoints
      {...props}
      employees={state}
      departments={departments}
      customers={customers}
    ></EmployeesAppoints>
  );
};

export default EmployeesCalendar;
