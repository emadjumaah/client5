import { gql } from "@apollo/client";

export default gql`
  mutation deleteTask($id: Int) {
    deleteTask(id: $id) {
      ok
      message
      error
    }
  }
`;
