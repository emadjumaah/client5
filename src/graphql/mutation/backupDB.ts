import { gql } from "@apollo/client";

export default gql`
  mutation backupDB {
    backupDB {
      ok
      message
      error
    }
  }
`;
