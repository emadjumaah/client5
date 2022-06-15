import { gql } from '@apollo/client';

export default gql`
  query getProjects($isRTL: Boolean) {
    getProjects(isRTL: $isRTL) {
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

        type
        start
        end
        location {
          lat
          lng
        }
        priority
        status

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

        customerId
        customerName
        customerNameAr
        customerPhone

        departmentId
        departmentName
        departmentNameAr
        departmentColor

        employeeId
        employeeName
        employeeNameAr
        employeeColor
        employeePhone

        resourseId
        resourseName
        resourseNameAr
        resourseColor

        userId

        createdAt
        updatedAt
      }
    }
  }
`;
