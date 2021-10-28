import React from 'react';
import useDepartmentsUp from '../../hooks/useDepartmentsUp';
import useEmployeesUp from '../../hooks/useEmployeesUp';
import useResoursesUp from '../../hooks/useResoursesUp';
import Main from './Main';

const MainCalendar = (props: any) => {
  const { employees } = useEmployeesUp();
  const { departments } = useDepartmentsUp();
  const { resourses } = useResoursesUp();
  return (
    <Main
      {...props}
      resourses={resourses}
      employees={employees}
      departments={departments}
    ></Main>
  );
};

export default MainCalendar;
