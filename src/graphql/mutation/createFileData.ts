import { gql } from '@apollo/client';

export default gql`
  mutation createFileData(
    $filename: String
    $filetype: String
    $onlinename: String
    $url: String
    $size: Float
    $opId: String
    $itemId: String
    $customerId: String
    $supplierId: String
    $departmentId: String
    $employeeId: String
    $projectId: String
    $resourseId: String
    $taskId: String
    $reminderId: String
    $userId: String
  ) {
    createFileData(
      filename: $filename
      filetype: $filetype
      onlinename: $onlinename
      url: $url
      size: $size
      opId: $opId
      itemId: $itemId
      customerId: $customerId
      supplierId: $supplierId
      departmentId: $departmentId
      employeeId: $employeeId
      projectId: $projectId
      resourseId: $resourseId
      taskId: $taskId
      reminderId: $reminderId
      userId: $userId
    ) {
      ok
      message
      data
      error
    }
  }
`;
