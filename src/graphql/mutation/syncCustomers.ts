import { gql } from '@apollo/client';

export default gql`
  mutation syncCustomers {
    syncCustomers {
      ok
      message
      error
    }
  }
`;
