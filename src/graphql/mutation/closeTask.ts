import { gql } from '@apollo/client';

export default gql`
  mutation closeTask($id: Int, $event: String) {
    closeTask(id: $id, event: $event) {
      ok
      message
      error
    }
  }
`;
