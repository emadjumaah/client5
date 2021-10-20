import { gql } from '@apollo/client';

export default gql`
  mutation deleteStep($_id: String) {
    deleteStep(_id: $_id) {
      ok
      message
      error
    }
  }
`;
