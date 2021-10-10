import { gql } from "@apollo/client";

export default gql`
  mutation deleteDepartment($_id: String) {
    deleteDepartment(_id: $_id) {
      ok
      message
      error
    }
  }
`;
