import { gql } from '@apollo/client';

export default gql`
  mutation deleteSendreq($_id: String) {
    deleteSendreq(_id: $_id) {
      ok
      message
      error
    }
  }
`;
