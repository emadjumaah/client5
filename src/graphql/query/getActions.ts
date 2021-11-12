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
        active
        sendtime
        sent
        phone
        email
        userId
        title
        body
        user
        smsqty

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

        createdAt
        updatedAt
      }
    }
  }
`;
