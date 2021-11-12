import { gql } from '@apollo/client';

export default gql`
  mutation syncEmployees {
    syncEmployees {
      ok
      message
      error
    }
  }
`;
