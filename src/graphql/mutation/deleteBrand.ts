import { gql } from "@apollo/client";

export default gql`
  mutation deleteBrand($_id: String) {
    deleteBrand(_id: $_id) {
      ok
      message
      error
    }
  }
`;
