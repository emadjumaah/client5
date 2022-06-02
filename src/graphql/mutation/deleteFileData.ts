import { gql } from '@apollo/client';

export default gql`
  mutation deleteFileData($_id: String) {
    deleteFileData(_id: $_id) {
      ok
      message
      error
    }
  }
`;
