import { gql } from '@apollo/client';

export default gql`
  query getSendreqs {
    getSendreqs {
      ok
      error
      data {
        _id
        branch
        id
        title
        body
        link
        qty
        smsqty
        type
        contacts
        groups

        ooListId
        ooListName
        ooListNameAr

        from
        to
        count

        rRule
        runtime
        lastrun
        runlog
        active
        sendqty
        failqty
        userId

        createdAt
        updatedAt
      }
    }
  }
`;
