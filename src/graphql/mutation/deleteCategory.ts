import { gql } from "@apollo/client";

export default gql`
  mutation deleteCategory($_id: String) {
    deleteCategory(_id: $_id) {
      ok
      message
      error
    }
  }
`;
