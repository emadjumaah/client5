import { gql } from "@apollo/client";

export default gql`
  mutation runClosing {
    runClosing {
      ok
      message
      error
    }
  }
`;
