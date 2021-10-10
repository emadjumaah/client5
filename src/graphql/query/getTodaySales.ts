import { gql } from "@apollo/client";

export default gql`
  query getTodaySales {
    getTodaySales {
      ok
      error
      message
      data {
        _id

        opId
        opType
        opTime
        opDocNo

        refNo
        refType

        customerId
        customerName
        customerNameAr

        departmentId
        departmentName
        departmentNameAr

        employeeId
        employeeName
        employeeNameAr

        categoryId
        categoryName
        categoryNameAr

        itemId
        itemName
        itemNameAr

        qty
        itemPrice

        amount
        debit
        credit

        accName
        accNameAr
        accType
        kaidType

        opaccName
        opaccNameAr

        userId

        createdAt
        updatedAt
      }
    }
  }
`;
