import { gql } from '@apollo/client';

export default gql`
  mutation updateFileData(
    $_id: String
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
    $contractId: String
    $reminderId: String
    $userId: String
  ) {
    updateFileData(
      _id: $_id
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
      contractId: $contractId
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
