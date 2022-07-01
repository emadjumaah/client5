import { gql } from '@apollo/client';

export default gql`
  query getRemindersActions(
    $type: Int
    $active: Boolean
    $departmentId: String
    $employeeId: String
    $projectId: String
    $resourseId: String
    $customerId: String
    $contractId: String
    $eventId: Int
    $reminderId: Int
    $start: Date
    $end: Date
  ) {
    getRemindersActions(
      type: $type
      active: $active
      departmentId: $departmentId
      employeeId: $employeeId
      projectId: $projectId
      resourseId: $resourseId
      customerId: $customerId
      contractId: $contractId
      eventId: $eventId
      reminderId: $reminderId
      start: $start
      end: $end
    ) {
      ok
      error
      data {
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
  }
`;
