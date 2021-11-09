import { gql } from '@apollo/client';

export default gql`
  mutation updateSendreq(
    $_id: String
    $title: String
    $body: String
    $qty: Int
    $type: Int
    $contacts: [String]
    $groups: [String]
    $rRule: String
    $active: Boolean
    $runtime: Date
  ) {
    updateSendreq(
      _id: $_id
      title: $title
      body: $body
      qty: $qty
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
