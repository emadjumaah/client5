import { gql } from '@apollo/client';

export default gql`
  mutation deleteRetype($_id: String) {
    deleteRetype(_id: $_id) {
      ok
      message
      error
    }
  }
`;
