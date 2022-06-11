import { gql } from '@apollo/client';

export default gql`
  query getExpenses(
    $start: Date
    $end: Date
    $search: String
    $taskId: Int
    $customerId: String
    $supplierId: String
    $departmentId: String
    $employeeId: String
    $projectId: String
    $resourseId: String
    $opType: Int
  ) {
    getExpenses(
      start: $start
      end: $end
      search: $search
      taskId: $taskId
      customerId: $customerId
      supplierId: $supplierId
      departmentId: $departmentId
      employeeId: $employeeId
      projectId: $projectId
      resourseId: $resourseId
      opType: $opType
    ) {
      ok
      error
      count
      data {
        _id
        branch
        autoNo
        docNo
        opType
        time
        title
        desc

        taskId

        customerId
        customerName
        customerNameAr
        customerPhone

        employeeId
        employeeName
        employeeNameAr
        employeePhone

        departmentId
        departmentName
        departmentNameAr
        departmentColor

        projectId
        projectName
        projectNameAr
        projectColor
        resourseId
        resourseName
        resourseNameAr
        resourseColor

        refNo
        refType

        amount

        debitAcc
        debitAccName
        debitAccNameAr
        creditAcc
        creditAccName
        creditAccNameAr

        chequeBank
        chequeNo
        chequeDate

        userId
        note

        createdAt
        updatedAt
      }
    }
  }
`;
