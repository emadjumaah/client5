import {
  getCustomers,
  getDepartments,
  getEmployees,
  getProjects,
  getResourses,
  getSuppliers,
  getTasks,
} from './query';

export const getRefresQuery = ({
  isRTL,
  customer,
  supplier,
  employee,
  department,
  resourse,
  project,
  contract,
}: any) => {
  const qlist = [];
  if (department && department?.departmentId)
    qlist.push({ query: getDepartments });
  if (employee && employee?.employeeId) qlist.push({ query: getEmployees });
  if (resourse && resourse?.resourseId) qlist.push({ query: getResourses });
  if (contract && contract?.contractId) qlist.push({ query: getTasks });
  if (project && project?.projectId) qlist.push({ query: getProjects });
  if (customer && customer?.customerId) qlist.push({ query: getCustomers });
  if (supplier && supplier?.supplierId) qlist.push({ query: getSuppliers });
  return qlist;
};

export const rQueriesCustomer = (isRTL: any) => [
  { query: getDepartments },
  { query: getEmployees },
  { query: getResourses },
  { query: getProjects },
  { query: getTasks },
  { query: getCustomers },
];
export const rQueriesSupplier = (isRTL: any) => [
  { query: getDepartments },
  { query: getEmployees },
  { query: getResourses },
  { query: getProjects },
  { query: getTasks },
  { query: getSuppliers },
];
