import { gql } from '@apollo/client';

export default gql`
  query getTaskDoneEvents($contractId: String) {
    getTaskDoneEvents(contractId: $contractId) {
      ok
      error
      data
      message
    }
  }
`;
