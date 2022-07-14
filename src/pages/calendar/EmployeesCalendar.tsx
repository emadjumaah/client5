import React from 'react';
import { useCustomers, useServices } from '../../hooks';
import useDepartments from '../../hooks/useDepartments';
import useEmployees from '../../hooks/useEmployees';
import EmployeesAppoints from './Employees';

const EmployeesCalendar = (props: any) => {
  const { employees } = useEmployees();
  const { departments } = useDepartments();
  const { customers } = useCustomers();
  const { services } = useServices();

  return (
    <EmployeesAppoints
      {...props}
      employees={employees}
      services={services}
      departments={departments}
      customers={customers}
    ></EmployeesAppoints>
  );
};

export default EmployeesCalendar;
