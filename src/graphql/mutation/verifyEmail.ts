import { gql } from '@apollo/client';

export default gql`
  mutation verifyEmail($email: String, $passcode: Int) {
    verifyEmail(email: $email, passcode: $passcode) {
      ok
      message
      data
      error
    }
  }
`;
