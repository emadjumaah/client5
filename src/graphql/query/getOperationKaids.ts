import { gql } from "@apollo/client";
export default gql`
  query getOperationKaids($opId: String) {
    getOperationKaids(opId: $opId) {
      ok
      error
      count
      data {
        _id
        branch
        opType
        opTime
        opDocNo
        desc

        refNo
        refType

        amount

        shareId
        accId
        accCode
        accType
        accName
        accNameAr
        opaccId
        opaccCode
        opaccType
        opaccName
        opaccNameAr
        kaidType
        amount
        debit
        credit

        userId
        note

        createdAt
        updatedAt
      }
    }
  }
`;
