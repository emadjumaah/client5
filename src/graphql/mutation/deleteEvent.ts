import { gql } from "@apollo/client";

export default gql`
  mutation deleteEvent($id: Int) {
    deleteEvent(id: $id) {
      ok
      message
      error
    }
  }
`;
