import { gql } from '@apollo/client';

export default gql`
  mutation createSendreq(
    $title: String
    $body: String
    $link: String
    $qty: Int
    $smsqty: Int
    $type: Int
    $contacts: [String]
    $groups: [String]
    $ooListId: String
    $ooListName: String
    $ooListNameAr: String
    $from: Int
    $to: Int
    $count: Int
    $rRule: String
    $active: Boolean
    $runtime: Date
  ) {
    createSendreq(
      title: $title
      body: $body
      link: $link
      qty: $qty
      smsqty: $smsqty
      type: $type
      contacts: $contacts
      groups: $groups
      ooListId: $ooListId
      ooListName: $ooListName
      ooListNameAr: $ooListNameAr
      from: $from
      to: $to
      count: $count
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
