import { gql } from '@apollo/client';

export default gql`
  query getCustMonthlyReport(
    $accPCode: Int
    $itemType: Int
    $accountIds: [String]
    $serviceIds: [String]
    $categoryIds: [String]
    $departmentIds: [String]
    $projectIds: [String]
    $resourseIds: [String]
    $employeeIds: [String]
    $customerIds: [String]
    $contractIds: [String]
    $parentcodes: [Int]
    $start: Date
    $end: Date
  ) {
    getCustMonthlyReport(
      accPCode: $accPCode
      itemType: $itemType
      accountIds: $accountIds
      serviceIds: $serviceIds
      categoryIds: $categoryIds
      departmentIds: $departmentIds
      projectIds: $projectIds
      resourseIds: $resourseIds
      employeeIds: $employeeIds
      customerIds: $customerIds
      contractIds: $contractIds
      parentcodes: $parentcodes
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
