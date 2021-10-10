import { gql } from "@apollo/client";

export default gql`
  mutation restoreDB($path: String) {
    restoreDB(path: $path) {
      ok
      message
      error
    }
  }
`;
