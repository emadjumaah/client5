import { gql } from '@apollo/client';

export default gql`
  query getNotificationsList(
    $start: Date
    $end: Date
    $reminderId: Int
    $eventId: Int
    $contractId: String
    $customerId: String
    $departmentId: String
    $employeeId: String
    $projectId: String
    $resourseId: String
  ) {
    getNotificationsList(
      start: $start
      end: $end
      reminderId: $reminderId
      eventId: $eventId
      contractId: $contractId
      customerId: $customerId
      departmentId: $departmentId
      employeeId: $employeeId
      projectId: $projectId
      resourseId: $resourseId
    ) {
      ok
      error
      data {
        _id
        branch
        active
        sendtime
        sent
        phone
        title
        body
        smsqty
        user
        reminderId
        eventId
        employeeId
        departmentId
        customerId
        contractId
        resourseId
        projectId
        info
        amount

        createdAt
        updatedAt
      }
    }
  }
`;
