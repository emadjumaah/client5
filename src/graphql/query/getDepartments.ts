import { gql } from '@apollo/client';

export default gql`
  query getDepartments($isRTL: Boolean, $depType: Int) {
    getDepartments(isRTL: $isRTL, depType: $depType) {
      ok
      error
      data {
        _id
        depType
        branch
        autoNo
        docNo
        name
        nameAr
        color
        desc
        amount
        totalinvoiced
        totalDiscount
        totalPurchaseInvoiced
        totalPurchasePaid
        totalPurchaseDiscount
        toatlProdExpenses
        totalpaid
        toatlExpenses
        totalkaidsdebit
        totalKaidscredit
        progress
        evQty
        evDone

        retypeId
        retypeName
        retypeNameAr
        retypeColor

        userId

        createdAt
        updatedAt
      }
    }
  }
`;
