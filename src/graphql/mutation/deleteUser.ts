import { gql } from "@apollo/client";

export default gql`
  mutation deleteUser($_id: String) {
    deleteUser(_id: $_id) {
      ok
      message
      error
    }
  }
`;
