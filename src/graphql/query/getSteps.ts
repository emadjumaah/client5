import { gql } from '@apollo/client';

export default gql`
  query getSteps($eventId: Int, $taskId: Int) {
    getSteps(eventId: $eventId, taskId: $taskId) {
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
