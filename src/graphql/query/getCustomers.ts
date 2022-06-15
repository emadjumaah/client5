import { gql } from '@apollo/client';

export default gql`
  query getCustomers($isRTL: Boolean) {
    getCustomers(isRTL: $isRTL) {
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
        avatar
        logo
        headphoto

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

        employeeId
        employeeName
        employeeNameAr
        employeeColor
        employeePhone

        driver
        licenseNo
        licenseDate
        national
        nationalNo
        nationalDate

        userId

        createdAt
        updatedAt
      }
    }
  }
`;
