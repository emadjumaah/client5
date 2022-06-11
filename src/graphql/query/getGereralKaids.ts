import { gql } from '@apollo/client';

export default gql`
  query getGereralKaids(
    $departmentId: String
    $employeeId: String
    $projectId: String
    $resourseId: String
    $customerId: String
    $supplierId: String
    $taskId: Int
    $start: Date
    $end: Date
  ) {
    getGereralKaids(
      departmentId: $departmentId
      employeeId: $employeeId
      projectId: $projectId
      resourseId: $resourseId
      customerId: $customerId
      supplierId: $supplierId
      taskId: $taskId
      start: $start
      end: $end
    ) {
      ok
      error
      count
      data {
        _id

        opId
        opType
        opTime
        opDocNo

        refNo
        refType

        supplierId
        supplierName
        supplierNameAr

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
