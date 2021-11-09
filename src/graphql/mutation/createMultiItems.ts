import { gql } from '@apollo/client';

export default gql`
  mutation createMultiItems($data: String) {
    createMultiItems(data: $data) {
      ok
      message
      error
    }
  }
`;
