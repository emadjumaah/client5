import { gql } from '@apollo/client';

export default gql`
  query getResourses($isRTL: Boolean, $resType: Int, $departmentId: String) {
    getResourses(
      isRTL: $isRTL
      resType: $resType
      departmentId: $departmentId
    ) {
      ok
      error
      data {
        _id
        branch
        autoNo
        docNo
        name
        nameAr
        color
        resType

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
        isInactive

        carstatus
        garage
        busy

        departmentId
        departmentName
        departmentNameAr
        departmentColor
        info
        userId

        documentNo
        startDate
        endDate

        brand
        plate
        cost
        model
        purtime
        insurance

        type

        createdAt
        updatedAt
      }
    }
  }
`;
