import { gql } from '@apollo/client';

export default gql`
  mutation createMultiContacts($data: String) {
    createMultiContacts(data: $data) {
      ok
      message
      data
      error
    }
  }
`;
