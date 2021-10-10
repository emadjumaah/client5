import { gql } from "@apollo/client";

export default gql`
  mutation changePassword(
    $_id: String
    $password: String
    $newPassword: String
  ) {
    changePassword(_id: $_id, password: $password, newPassword: $newPassword) {
      ok
      message
      data
      error
    }
  }
`;
