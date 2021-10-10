import { gql } from "@apollo/client";

export default gql`
  mutation deleteAction($_id: String) {
    deleteAction(_id: $_id) {
      ok
      message
      error
    }
  }
`;
