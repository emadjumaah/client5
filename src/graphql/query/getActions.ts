import { gql } from '@apollo/client';

export default gql`
  query getActions($type: Int, $active: Boolean, $eventId: Int, $taskId: Int) {
    getActions(
      type: $type
      active: $active
      eventId: $eventId
      taskId: $taskId
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
        phone
        email
        userId
        title
        body
        user
        smsqty
        eventId
        taskId
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
