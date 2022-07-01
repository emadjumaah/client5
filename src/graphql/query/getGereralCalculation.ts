import { gql } from '@apollo/client';

export default gql`
  query getGereralCalculation(
    $departmentId: String
    $employeeId: String
    $projectId: String
    $resourseId: String
    $customerId: String
    $supplierId: String
    $contractId: String
    $start: Date
    $end: Date
  ) {
    getGereralCalculation(
      departmentId: $departmentId
      employeeId: $employeeId
      projectId: $projectId
      resourseId: $resourseId
      customerId: $customerId
      supplierId: $supplierId
      contractId: $contractId
      start: $start
      end: $end
    ) {
      ok
      error
      data
      message
    }
  }
`;
