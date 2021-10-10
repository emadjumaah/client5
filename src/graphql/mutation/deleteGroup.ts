import { gql } from "@apollo/client";

export default gql`
  mutation deleteGroup($_id: String) {
    deleteGroup(_id: $_id) {
      ok
      message
      error
    }
  }
`;
