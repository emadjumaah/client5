import { gql } from "@apollo/client";

export default gql`
  query getCompany {
    getCompany {
      ok
      error
      data
      message
    }
  }
`;
