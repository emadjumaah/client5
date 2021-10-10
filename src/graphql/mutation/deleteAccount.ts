import { gql } from "@apollo/client";

export default gql`
  mutation deleteAccount($_id: String) {
    deleteAccount(_id: $_id) {
      ok
      message
      error
    }
  }
`;
