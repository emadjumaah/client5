import { gql } from '@apollo/client';

export default gql`
  query getAccounts {
    getAccounts {
      ok
      error
      data {
        _id

        branch
        code
        name
        nameAr
        parent
        parentAr
        parentcode
        accType
        balance
        canedit
        closedAcc
        note
        userId
        employeeId
        employeeName
        employeeNameAr

        createdAt
        updatedAt
      }
    }
  }
`;
