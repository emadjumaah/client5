import { gql } from "@apollo/client";

export default gql`
  mutation deletePurchaseInvoice($_id: String) {
    deletePurchaseInvoice(_id: $_id) {
      ok
      message
      error
    }
  }
`;
