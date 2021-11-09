import { gql } from '@apollo/client';

export default gql`
  mutation createAction(
    $branch: String
    $type: Int
    $active: Boolean
    $sendtime: Date
    $phone: String
    $email: String
    $userId: String
    $title: String
    $body: String
    $eventId: Int
    $taskId: Int
    $smsqty: Int
    $user: String
    $data: String
    $timeunit: String
    $timerelate: String
    $qty: Int
    $address: String
  ) {
    createAction(
      branch: $branch
      type: $type
      active: $active
      sendtime: $sendtime
      phone: $phone
      email: $email
      userId: $userId
      title: $title
      body: $body
      eventId: $eventId
      taskId: $taskId
      smsqty: $smsqty
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
