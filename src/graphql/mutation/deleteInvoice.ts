import { gql } from "@apollo/client";

export default gql`
  mutation deleteInvoice($_id: String) {
    deleteInvoice(_id: $_id) {
      ok
      message
      error
    }
  }
`;
