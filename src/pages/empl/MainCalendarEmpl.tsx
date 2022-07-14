import React from 'react';
import useDepartments from '../../hooks/useDepartments';
import useEmployees from '../../hooks/useEmployees';
import useResourses from '../../hooks/useResourses';
import MainEmpl from './MainEmpl';

const MainCalendarEmpl = (props: any) => {
  const { employees } = useEmployees();
  const { departments } = useDepartments();
  const { resourses } = useResourses();

  return (
    <MainEmpl
      {...props}
      resourses={resourses}
      employees={employees}
      departments={departments}
    ></MainEmpl>
  );
};

export default MainCalendarEmpl;
