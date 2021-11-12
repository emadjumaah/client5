import { gql } from '@apollo/client';

export default gql`
  query getMessages {
    getMessages {
      ok
      error
      data {
        _id
        branch
        eventId
        customerId
        phone
        title
        body
        qty
        status
        userId
        createdAt
        updatedAt
      }
    }
  }
`;
