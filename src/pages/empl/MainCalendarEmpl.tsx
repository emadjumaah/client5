import React from 'react';
import useDepartmentsUp from '../../hooks/useDepartmentsUp';
import useEmployeesUp from '../../hooks/useEmployeesUp';
import useResoursesUp from '../../hooks/useResoursesUp';
import MainEmpl from './MainEmpl';

const MainCalendarEmpl = (props: any) => {
  const { employees } = useEmployeesUp();
  const { departments } = useDepartmentsUp();
  const { resourses } = useResoursesUp();

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
