import { gql } from '@apollo/client';

export default gql`
  mutation updateRelatedAndItems(
    $itemIds: [String]
    $contractId: String
    $customerId: String
    $supplierId: String
    $employeeId: String
    $departmentId: String
    $resourseId: String
    $projectId: String
  ) {
    updateRelatedAndItems(
      itemIds: $itemIds
      contractId: $contractId
      customerId: $customerId
      supplierId: $supplierId
      employeeId: $employeeId
      departmentId: $departmentId
      resourseId: $resourseId
      projectId: $projectId
    ) {
      ok
      message
      data
      error
    }
  }
`;
