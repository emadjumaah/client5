import { gql } from "@apollo/client";

export default gql`
  mutation deleteSupplier($_id: String) {
    deleteSupplier(_id: $_id) {
      ok
      message
      error
    }
  }
`;
