import { gql } from '@apollo/client';

export default gql`
  query getSteps($eventId: Int, $contractId: String) {
    getSteps(eventId: $eventId, contractId: $contractId) {
      ok
      error
      data {
        _id
        branch
        eventId
        opId
        title
        desc
        location {
          lat
          lng
        }
        photos
        name
        content
        userId

        createdAt
        updatedAt
      }
    }
  }
`;
