import { gql } from "@apollo/client";

export default gql`
  query getReportDocuments(
    $types: [Int]
    $serviceIds: [String]
    $categoryIds: [String]
    $departmentIds: [String]
    $employeeIds: [String]
    $customerIds: [String]
    $supplierIds: [String]
    $taskIds: [Int]
    $status: Int
    $start: Date
    $end: Date
  ) {
    getReportDocuments(
      types: $types
      serviceIds: $serviceIds
      categoryIds: $categoryIds
      departmentIds: $departmentIds
      employeeIds: $employeeIds
      customerIds: $customerIds
      supplierIds: $supplierIds
      taskIds: $taskIds
      status: $status
      start: $start
      end: $end
    ) {
      ok
      error
      message
      count
      data {
        _id
        opType
        taskId
        branch
        time
        title
        startDate
        endDate
        allDay
        rRule
        reminder
        exDate
        allowDrag

        autoNo
        docNo
        priority
        amount
        status

        customerId
        customerName
        customerNameAr
        customerPhone

        itemId
        itemName
        itemNameAr

        departmentId
        departmentName
        departmentNameAr
        departmentColor

        employeeId
        employeeName
        employeeNameAr
        employeeColor
        employeePhone

        refNo
        refType

        createdAt
        updatedAt
      }
    }
  }
`;
