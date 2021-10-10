import { gql } from "@apollo/client";

export default gql`
  mutation deleteGeneralFinance($_id: String) {
    deleteGeneralFinance(_id: $_id) {
      ok
      message
      error
    }
  }
`;
