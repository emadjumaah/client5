import { gql } from '@apollo/client';

export default gql`
  mutation updateStep(
    $_id: String
    $branch: String
    $eventId: Int
    $taskId: Int
    $opId: String
    $title: String
    $desc: String
    $location: LocationInput
    $status: String
    $photos: String
    $name: String
    $content: String
  ) {
    updateStep(
      _id: $_id
      branch: $branch
      eventId: $eventId
      taskId: $taskId
      opId: $opId
      title: $title
      desc: $desc
      location: $location
      status: $status
      photos: $photos
      name: $name
      content: $content
    ) {
      ok
      message
      data
      error
    }
  }
`;
