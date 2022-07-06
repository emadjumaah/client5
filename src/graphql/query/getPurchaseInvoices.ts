import { gql } from '@apollo/client';
export default gql`
  query getPurchaseInvoices(
    $departmentId: String
    $employeeId: String
    $projectId: String
    $resourseId: String
    $supplierId: String
    $contractId: String
    $start: Date
    $end: Date
    $search: String
  ) {
    getPurchaseInvoices(
      departmentId: $departmentId
      employeeId: $employeeId
      projectId: $projectId
      resourseId: $resourseId
      supplierId: $supplierId
      contractId: $contractId
      start: $start
      end: $end
      search: $search
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
        eventNo

        costAmount
        total
        discount
        profit
        amount
        credit
        debit

        debitAcc
        creditAcc

        paymentType

        inhand
        change

        amountPaid
        isPaid
        isCash
        opId

        userId
        note

        createdAt
        updatedAt
      }
    }
  }
`;
