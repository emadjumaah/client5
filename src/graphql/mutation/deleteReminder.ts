import { gql } from '@apollo/client';

export default gql`
  mutation deleteReminder($_id: String) {
    deleteReminder(_id: $_id) {
      ok
      message
      error
    }
  }
`;
