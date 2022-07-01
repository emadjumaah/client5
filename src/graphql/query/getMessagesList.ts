import { gql } from '@apollo/client';

export default gql`
  query getMessagesList(
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
    getMessagesList(
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
        phones
        transres
        title
        body
        smsqty
        reminderId
        eventId
        employeeId
        departmentId
        customerId
        contractId
        resourseId
        projectId

        createdAt
        updatedAt
      }
    }
  }
`;
