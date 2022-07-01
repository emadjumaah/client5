import { gql } from '@apollo/client';

export default gql`
  query getFinances($start: Date, $end: Date, $search: String) {
    getFinances(start: $start, end: $end, search: $search) {
      ok
      error
      count
      data {
        _id
        branch
        autoNo
        docNo
        opType
        time
        title
        desc

        contractId
        contractName
        contractNameAr

        customerId
        customerName
        customerNameAr
        customerPhone

        refNo
        refType

        amount

        debitAcc
        debitAccName
        debitAccNameAr
        creditAcc
        creditAccName
        creditAccNameAr

        chequeBank
        chequeNo
        chequeDate

        userId
        note

        createdAt
        updatedAt
      }
    }
  }
`;
