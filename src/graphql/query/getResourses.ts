import { gql } from '@apollo/client';

export default gql`
  query getResourses($isRTL: Boolean, $resType: Int) {
    getResourses(isRTL: $isRTL, resType: $resType) {
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
        totalpaid
        toatlExpenses
        totalkaidsdebit
        totalKaidscredit

        progress
        evQty
        evDone

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
