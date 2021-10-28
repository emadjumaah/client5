import { gql } from '@apollo/client';

export default gql`
  mutation deleteResourse($_id: String) {
    deleteResourse(_id: $_id) {
      ok
      message
      error
    }
  }
`;
