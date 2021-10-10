import { gql } from "@apollo/client";

export default gql`
  query getSalesReport(
    $itemId: String
    $categoryId: String
    $departmentId: String
    $employeeId: String
    $customerId: String
    $supplierId: String
    $start: Date
    $end: Date
  ) {
    getSalesReport(
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

        userId

        createdAt
        updatedAt
      }
    }
  }
`;
