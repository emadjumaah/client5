import { gql } from '@apollo/client';

export default gql`
  mutation createMultiFileDatas($data: String) {
    createMultiFileDatas(data: $data) {
      ok
      message
      data
      error
    }
  }
`;
