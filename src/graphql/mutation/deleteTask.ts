import { gql } from '@apollo/client';

export default gql`
  mutation deleteTask($_id: Int) {
    deleteTask(_id: $_id) {
      ok
      message
      error
    }
  }
`;
