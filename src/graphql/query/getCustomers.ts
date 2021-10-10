import { gql } from "@apollo/client";

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

        amount
        totalinvoiced
        totalDiscount
        totalpaid
        toatlExpenses

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
