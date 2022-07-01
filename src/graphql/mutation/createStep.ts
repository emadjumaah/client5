import { gql } from '@apollo/client';

export default gql`
  mutation createStep(
    $branch: String
    $eventId: Int
    $contractId: String
    $opId: String
    $title: String
    $desc: String
    $location: LocationInput
    $status: String
    $photos: String
    $name: String
    $content: String
  ) {
    createStep(
      branch: $branch
      eventId: $eventId
      contractId: $contractId
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
