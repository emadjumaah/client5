import { gql } from '@apollo/client';

export default gql`
  mutation deleteContact($_id: String) {
    deleteContact(_id: $_id) {
      ok
      message
      error
    }
  }
`;
