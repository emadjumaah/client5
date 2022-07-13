import { gql } from '@apollo/client';

export default gql`
  mutation updateAction(
    $_id: String
    $branch: String
    $type: Int
    $active: Boolean
    $sent: Boolean
    $sendtime: Date
    $phone: String
    $email: String
    $userId: String
    $title: String
    $body: String
    $smsqty: Int
    $reminderId: Int
    $eventId: Int
    $employeeId: String
    $departmentId: String
    $customerId: String
    $resourseId: String
    $projectId: String
    $contractId: String
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
      sent: $sent
      sendtime: $sendtime
      phone: $phone
      email: $email
      userId: $userId
      title: $title
      body: $body
      smsqty: $smsqty
      reminderId: $reminderId
      eventId: $eventId
      employeeId: $employeeId
      departmentId: $departmentId
      customerId: $customerId
      resourseId: $resourseId
      projectId: $projectId
      contractId: $contractId
      user: $user
      data: $data
      timeunit: $timeunit
      timerelate: $timerelate
      qty: $qty
      address: $address
    ) {
      _id
      branch
      autoNo
      indx
      type
      sendtime
      phone
      email
      user
      title
      body
      sent
      active
      smsqty

      phones
      emails
      users
      transres

      reminderId
      eventId

      employeeId
      departmentId
      customerId
      resourseId
      projectId
      contractId

      data
      info

      timeunit
      timerelate
      qty
      address

      userId
      createdAt
      updatedAt
    }
  }
`;
