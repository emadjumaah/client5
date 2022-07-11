import { gql } from '@apollo/client';

export default gql`
  query getExpenses(
    $start: Date
    $end: Date
    $search: String
    $contractId: String
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
      contractId: $contractId
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

        customerId
        customerName
        customerNameAr
        customerPhone

        supplierId
        supplierName
        supplierNameAr

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

        contractId
        contractName
        contractNameAr

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
