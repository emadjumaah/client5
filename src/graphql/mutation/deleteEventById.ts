import { gql } from "@apollo/client";

export default gql`
  mutation deleteEventById($_id: String) {
    deleteEventById(_id: $_id) {
      ok
      message
      error
    }
  }
`;
