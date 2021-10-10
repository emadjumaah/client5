import { gql } from "@apollo/client";

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
    $eventId: Int
    $taskId: Int
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
      eventId: $eventId
      taskId: $taskId
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
