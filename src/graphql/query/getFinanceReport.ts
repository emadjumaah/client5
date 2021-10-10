import { gql } from "@apollo/client";

export default gql`
  query getFinanceReport(
    $accCode: Int
    $accPCode: Int
    $opaccCode: Int
    $opaccPCode: Int
    $itemId: String
    $categoryId: String
    $departmentId: String
    $employeeId: String
    $customerId: String
    $supplierId: String
    $start: Date
    $end: Date
  ) {
    getFinanceReport(
      accCode: $accCode
      accPCode: $accPCode
      opaccCode: $opaccCode
      opaccPCode: $opaccPCode
      itemId: $itemId
      categoryId: $categoryId
      departmentId: $departmentId
      employeeId: $employeeId
      customerId: $customerId
      supplierId: $supplierId
      start: $start
      end: $end
    ) {
      ok
      error
      message
      data {
        _id

        opId
        opType
        opTime
        opDocNo

        accCode
        accName
        accNameAr

        opaccCode
        opaccName
        opaccNameAr

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

        kaidType
        amount
        debit
        credit
        accType

        userId

        createdAt
        updatedAt
      }
    }
  }
`;
