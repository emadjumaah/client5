import { gql } from '@apollo/client';

export default gql`
  query getKaidsReport(
    $opTypes: [Int]
    $itemTypes: [Int]
    $itemIds: [String]
    $projectIds: [String]
    $contractIds: [String]
    $departmentIds: [String]
    $employeeIds: [String]
    $resourseIds: [String]
    $customerIds: [String]
    $supplierIds: [String]
    $accountIds: [String]
    $accountCodes: [Int]
    $parentCodes: [Int]
    $start: Date
    $end: Date
  ) {
    getKaidsReport(
      opTypes: $opTypes
      itemTypes: $itemTypes
      itemIds: $itemIds
      projectIds: $projectIds
      contractIds: $contractIds
      departmentIds: $departmentIds
      employeeIds: $employeeIds
      resourseIds: $resourseIds
      customerIds: $customerIds
      supplierIds: $supplierIds
      accountIds: $accountIds
      accountCodes: $accountCodes
      parentCodes: $parentCodes
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

        projectId
        projectName
        projectNameAr

        resourseId
        resourseName
        resourseNameAr

        categoryId
        categoryName
        categoryNameAr

        contractId
        contractName
        contractNameAr

        itemId
        itemName
        itemNameAr

        qty
        itemPrice

        eventId

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
