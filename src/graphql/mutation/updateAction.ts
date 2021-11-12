import { gql } from '@apollo/client';

export default gql`
  mutation updateAction(
    $_id: String
    $branch: String
    $type: Int
    $active: Boolean
    $sendtime: Date
    $phone: String
    $email: String
    $userId: String
    $title: String
    $body: String
    $smsqty: Int
    $reminderId: Int
    $eventId: Int
    $taskId: Int
    $employeeId: String
    $departmentId: String
    $customerId: String
    $resourseId: String
    $projectId: String
    $user: String
    $data: String
    $timeunit: String
    $timerelate: String
    $qty: Int
    $address: String
  ) {
    updateAction(
      _id: $_id
      branch: $branch
      type: $type
      active: $active
      sendtime: $sendtime
      phone: $phone
      email: $email
      userId: $userId
      title: $title
      body: $body
      smsqty: $smsqty
      reminderId: $reminderId
      eventId: $eventId
      taskId: $taskId
      employeeId: $employeeId
      departmentId: $departmentId
      customerId: $customerId
      resourseId: $resourseId
      projectId: $projectId
      user: $user
      data: $data
      timeunit: $timeunit
      timerelate: $timerelate
      qty: $qty
      address: $address
    ) {
      ok
      message
      data
      error
    }
  }
`;
