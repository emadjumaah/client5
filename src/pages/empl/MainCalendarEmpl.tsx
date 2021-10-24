import React from 'react';
import { useDepartments, useEmployees } from '../../hooks';
import MainEmpl from './MainEmpl';

const MainCalendarEmpl = (props: any) => {
  const { employees } = useEmployees();
  const { departments } = useDepartments();
  return (
    <MainEmpl
      {...props}
      employees={employees}
      departments={departments}
    ></MainEmpl>
  );
};

export default MainCalendarEmpl;
