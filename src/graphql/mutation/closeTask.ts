import { gql } from '@apollo/client';

export default gql`
  mutation closeTask(
    $_id: String
    $id: Int
    $event: String
    $time: Date
    $del: Boolean
  ) {
    closeTask(_id: $_id, id: $id, event: $event, time: $time, del: $del) {
      ok
      message
      error
    }
  }
`;
