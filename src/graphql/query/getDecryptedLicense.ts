import { gql } from "@apollo/client";

export default gql`
  query getDecryptedLicense {
    getDecryptedLicense {
      ok
      error
      data
      message
    }
  }
`;
