import { gql } from '@apollo/client';

export default gql`
  mutation updateProject(
    $_id: String
    $branch: String
    $name: String
    $nameAr: String
    $type: String
    $start: Date
    $end: Date
    $progress: Float
    $status: Int
    $evQty: Int
    $evDone: Int
    $location: LocationInput
    $customer: CustomerInput
    $department: DepartmentInput
    $employee: EmployeeInput
    $resourse: ResourseInput
    $desc: String
    $color: String
  ) {
    updateProject(
      _id: $_id
      branch: $branch
      name: $name
      nameAr: $nameAr
      type: $type
      start: $start
      end: $end
      progress: $progress
      status: $status
      evQty: $evQty
      evDone: $evDone
      location: $location
      customer: $customer
      department: $department
      employee: $employee
      resourse: $resourse
      desc: $desc
      color: $color
    ) {
      ok
      message
      data
      error
    }
  }
`;
