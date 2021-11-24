import { gql } from '@apollo/client';

export default gql`
  query getSendReqMessages($sendreqId: String) {
    getSendReqMessages(sendreqId: $sendreqId) {
      ok
      error
      data {
        _id
        branch
        from
        to
        count
        transres
        eventId
        customerId
        phone
        title
        body
        qty
        status
        userId
        createdAt
        updatedAt
      }
    }
  }
`;
