import { gql } from '@apollo/client';

export default gql`
  mutation updateRelatedAndItems(
    $itemIds: [String]
    $taskId: Int
    $customerId: String
    $supplierId: String
    $employeeId: String
    $departmentId: String
    $resourseId: String
    $projectId: String
  ) {
    updateRelatedAndItems(
      itemIds: $itemIds
      taskId: $taskId
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
