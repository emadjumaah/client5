import React from 'react';
import { useDepartments, useEmployees } from '../../hooks';
import Main from './Main';

const MainCalendar = (props: any) => {
  const { employees } = useEmployees();
  const { departments } = useDepartments();
  return (
    <Main {...props} employees={employees} departments={departments}></Main>
  );
};

export default MainCalendar;
