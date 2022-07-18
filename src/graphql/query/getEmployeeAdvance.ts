import { gql } from '@apollo/client';

export default gql`
  query getEmployeeAdvance($start: Date, $end: Date, $employeeId: String) {
    getEmployeeAdvance(
      start: $start
      end: $end

      employeeId: $employeeId
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

        supplierId
        supplierName
        supplierNameAr
        supplierPhone

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
