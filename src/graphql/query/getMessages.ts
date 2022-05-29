import { gql } from '@apollo/client';

export default gql`
  query getMessages($start: Date, $end: Date) {
    getMessages(start: $start, end: $end) {
      ok
      error
      data {
        _id
        branch
        eventId
        customerId
        phones
        title
        body
        qty
        status
        sent
        rejected
        userId
        createdAt
        updatedAt
      }
    }
  }
`;
