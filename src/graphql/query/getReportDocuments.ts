import { gql } from '@apollo/client';

export default gql`
  query getReportDocuments(
    $types: [Int]
    $serviceIds: [String]
    $categoryIds: [String]
    $departmentIds: [String]
    $employeeIds: [String]
    $projectIds: [String]
    $resourseIds: [String]
    $customerIds: [String]
    $supplierIds: [String]
    $contractIds: [String]
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
      projectIds: $projectIds
      resourseIds: $resourseIds
      customerIds: $customerIds
      supplierIds: $supplierIds
      contractIds: $contractIds
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

        supplierId
        supplierName
        supplierNameAr
        supplierPhone

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

        projectId
        projectName
        projectNameAr
        projectColor
        resourseId
        resourseName
        resourseNameAr
        resourseColor

        contractId
        contractName
        contractNameAr
        refNo
        refType

        createdAt
        updatedAt
      }
    }
  }
`;
