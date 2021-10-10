import { gql } from "@apollo/client";

export default gql`
  mutation deleteCustomer($_id: String) {
    deleteCustomer(_id: $_id) {
      ok
      message
      error
    }
  }
`;
