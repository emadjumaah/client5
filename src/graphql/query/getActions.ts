import { gql } from '@apollo/client';

export default gql`
  query getActions(
    $type: Int
    $active: Boolean
    $eventId: Int
    $contractId: String
    $reminderId: Int
    $start: Date
    $end: Date
  ) {
    getActions(
      type: $type
      active: $active
      eventId: $eventId
      contractId: $contractId
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
