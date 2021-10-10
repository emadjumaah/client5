import { gql } from "@apollo/client";

export default gql`
  mutation deleteFinance($_id: String) {
    deleteFinance(_id: $_id) {
      ok
      message
      error
    }
  }
`;
