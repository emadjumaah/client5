import React from 'react';
import { useCustomers, useServices } from '../../hooks';
import useDepartmentsUp from '../../hooks/useDepartmentsUp';
import useEmployeesUp from '../../hooks/useEmployeesUp';
import EmployeesAppoints from './Employees';

const EmployeesCalendar = (props: any) => {
  const { employees } = useEmployeesUp();
  const { departments } = useDepartmentsUp();
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
