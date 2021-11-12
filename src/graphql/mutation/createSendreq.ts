import { gql } from '@apollo/client';

export default gql`
  mutation createSendreq(
    $title: String
    $body: String
    $qty: Int
    $smsqty: Int
    $type: Int
    $contacts: [String]
    $groups: [String]
    $rRule: String
    $active: Boolean
    $runtime: Date
  ) {
    createSendreq(
      title: $title
      body: $body
      qty: $qty
      smsqty: $smsqty
      type: $type
      contacts: $contacts
      groups: $groups
      rRule: $rRule
      active: $active
      runtime: $runtime
    ) {
      ok
      message
      data
      error
    }
  }
`;
