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
        qty
        smsqty
        type
        contacts
        groups
        rRule
        runtime
        lastrun
        runlog
        active
        userId

        createdAt
        updatedAt
      }
    }
  }
`;
