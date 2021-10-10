import { gql } from "@apollo/client";

export default gql`
  mutation deleteExpenses($_id: String) {
    deleteExpenses(_id: $_id) {
      ok
      message
      error
    }
  }
`;
