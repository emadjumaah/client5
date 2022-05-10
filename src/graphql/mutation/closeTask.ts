import { gql } from '@apollo/client';

export default gql`
  mutation closeTask($id: Int, $event: String, $time: Date) {
    closeTask(id: $id, event: $event, time: $time) {
      ok
      message
      error
    }
  }
`;
