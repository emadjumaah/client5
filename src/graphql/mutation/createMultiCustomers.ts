import { gql } from '@apollo/client';

export default gql`
  mutation createMultiCustomers($data: String) {
    createMultiCustomers(data: $data) {
      ok
      message
      error
    }
  }
`;
