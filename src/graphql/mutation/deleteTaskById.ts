import { gql } from "@apollo/client";

export default gql`
  mutation deleteTaskById($_id: String) {
    deleteTaskById(_id: $_id) {
      ok
      message
      error
    }
  }
`;
