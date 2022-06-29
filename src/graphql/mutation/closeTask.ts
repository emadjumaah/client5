import { gql } from '@apollo/client';

export default gql`
  mutation closeTask($id: Int, $event: String, $time: Date, $del: Boolean) {
    closeTask(id: $id, event: $event, time: $time, del: $del) {
      ok
      message
      error
    }
  }
`;
