import { gql } from '@apollo/client';

export default gql`
  mutation deleteProject($_id: String) {
    deleteProject(_id: $_id) {
      ok
      message
      error
    }
  }
`;
