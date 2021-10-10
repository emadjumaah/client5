import { gql } from "@apollo/client";

export default gql`
  mutation deleteItem($_id: String) {
    deleteItem(_id: $_id) {
      ok
      message
      error
    }
  }
`;
