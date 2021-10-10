import { gql } from "@apollo/client";

export default gql`
  mutation deleteEmployee($_id: String) {
    deleteEmployee(_id: $_id) {
      ok
      message
      error
    }
  }
`;
