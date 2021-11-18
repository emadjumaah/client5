import { gql } from '@apollo/client';

export default gql`
  mutation sendVerificationCode($email: String) {
    sendVerificationCode(email: $email) {
      ok
      message
      data
      error
    }
  }
`;
