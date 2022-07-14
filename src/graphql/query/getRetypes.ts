import { gql } from '@apollo/client';

export default gql`
  query getRetypes($isRTL: Boolean, $reType: Int) {
    getRetypes(isRTL: $isRTL, reType: $reType) {
      ok
      error
      data {
        _id
        reType
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

        userId

        createdAt
        updatedAt
      }
    }
  }
`;
