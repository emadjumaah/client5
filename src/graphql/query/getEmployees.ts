import { gql } from '@apollo/client';

export default gql`
  query getEmployees($isRTL: Boolean, $resType: Int, $resKind: Int) {
    getEmployees(isRTL: $isRTL, resType: $resType, resKind: $resKind) {
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
        resKind
        resType

        amount
        totalinvoiced
        totalDiscount
        totalpaid
        toatlExpenses
        toatlProdExpenses
        totalkaidsdebit
        totalKaidscredit
        progress
        evQty
        evDone

        phone
        email
        comPercent
        departmentId
        departmentName
        departmentNameAr
        departmentColor
        daysoff
        info
        userId

        documentNo
        startDate
        endDate
        cost
        model
        type

        createdAt
        updatedAt
      }
    }
  }
`;
