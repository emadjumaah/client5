import { gql } from "@apollo/client";

export default gql`
  query checkUsername($username: String) {
    checkUsername(username: $username) {
      ok
      message
      data
      error
    }
  }
`;
