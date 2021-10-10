import { useEffect, useState } from "react";
import { useCustomers, useDepartments, useEmployees } from "../../hooks";
import EmployeesAppoints from "./Employees";

const EmployeesCalendar = (props: any) => {
  const [state, setstate] = useState([]);
  const { employees } = useEmployees();
  const { departments } = useDepartments();
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
