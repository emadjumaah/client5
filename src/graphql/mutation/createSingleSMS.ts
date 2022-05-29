import { gql } from '@apollo/client';

export default gql`
  mutation createSingleSMS($mobiles: [String], $msg: String, $qty: Int) {
    createSingleSMS(mobiles: $mobiles, msg: $msg, qty: $qty) {
      ok
      message
      data
      error
    }
  }
`;
