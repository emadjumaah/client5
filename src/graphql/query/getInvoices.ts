import { gql } from '@apollo/client';
export default gql`
  query getInvoices(
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
    getInvoices(
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

        periodfrom
        periodto

        customerId
        customerName
        customerNameAr
        customerPhone

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
        amount
        profit

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
