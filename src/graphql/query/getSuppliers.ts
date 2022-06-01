import { gql } from '@apollo/client';

export default gql`
  query getSuppliers($isRTL: Boolean) {
    getSuppliers(isRTL: $isRTL) {
      ok
      error
      data {
        _id
        branch
        autoNo
        docNo
        name
        nameAr
        phone
        mobile
        address
        email

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

        employeeId
        employeeName
        employeeNameAr
        employeeColor
        employeePhone

        userId

        createdAt
        updatedAt
      }
    }
  }
`;
