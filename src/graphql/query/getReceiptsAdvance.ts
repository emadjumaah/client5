import { gql } from '@apollo/client';

export default gql`
  query getReceiptsAdvance(
    $start: Date
    $end: Date
    $search: String
    $contractId: String
    $customerId: String
    $departmentId: String
    $employeeId: String
    $projectId: String
    $resourseId: String
  ) {
    getReceiptsAdvance(
      start: $start
      end: $end
      search: $search
      contractId: $contractId
      customerId: $customerId
      departmentId: $departmentId
      employeeId: $employeeId
      projectId: $projectId
      resourseId: $resourseId
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

        contractId
        contractName
        contractNameAr

        customerId
        customerName
        customerNameAr
        customerPhone

        departmentId
        departmentName
        departmentNameAr
        departmentColor

        employeeId
        employeeName
        employeeNameAr
        employeeColor

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
