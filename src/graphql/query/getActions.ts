import { gql } from '@apollo/client';

export default gql`
  query getActions(
    $type: Int
    $active: Boolean
    $eventId: Int
    $taskId: Int
    $reminderId: Int
    $start: Date
    $end: Date
  ) {
    getActions(
      type: $type
      active: $active
      eventId: $eventId
      taskId: $taskId
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
        taskId

        employeeId
        departmentId
        customerId
        resourseId
        projectId

        data

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
