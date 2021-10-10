import { gql } from "@apollo/client";

export default gql`
  query getAccountsRaseed {
    getAccountsRaseed {
      ok
      error
      data
      message
    }
  }
`;
