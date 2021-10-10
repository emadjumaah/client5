import { gql } from "@apollo/client";

export default gql`
  query getLastNos {
    getLastNos {
      ok
      error
      data
    }
  }
`;
