import { gql } from '@apollo/client';

export default gql`
  mutation changePasswordQuick($_id: String, $password: String) {
    changePasswordQuick(_id: $_id, password: $password) {
      ok
      message
      data
      error
    }
  }
`;
