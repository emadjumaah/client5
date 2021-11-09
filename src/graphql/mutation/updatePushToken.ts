import { gql } from '@apollo/client';

export default gql`
  mutation updatePushToken($pushToken: String, $notify: Boolean) {
    updatePushToken(pushToken: $pushToken, notify: $notify) {
      ok
      message
      error
    }
  }
`;
