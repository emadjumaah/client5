import { gql } from "@apollo/client";

export default gql`
  query getRasseds {
    getRasseds {
      ok
      error
      data
      message
    }
  }
`;
