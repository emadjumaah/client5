import { gql } from "@apollo/client";

export default gql`
  query getMonthlyReport(
    $accPCode: Int
    $itemType: Int
    $accountIds: [String]
    $serviceIds: [String]
    $categoryIds: [String]
    $departmentIds: [String]
    $employeeIds: [String]
    $customerIds: [String]
    $supplierIds: [String]
    $taskIds: [Int]
    $start: Date
    $end: Date
  ) {
    getMonthlyReport(
      accPCode: $accPCode
      itemType: $itemType
      accountIds: $accountIds
      serviceIds: $serviceIds
      categoryIds: $categoryIds
      departmentIds: $departmentIds
      employeeIds: $employeeIds
      customerIds: $customerIds
      supplierIds: $supplierIds
      taskIds: $taskIds
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

        eventId
        taskId

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
        desc

        createdAt
        updatedAt
      }
    }
  }
`;
