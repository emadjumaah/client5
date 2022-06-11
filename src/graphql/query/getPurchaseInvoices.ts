import { gql } from '@apollo/client';
export default gql`
  query getPurchaseInvoices(
    $taskId: Int
    $departmentId: String
    $employeeId: String
    $projectId: String
    $resourseId: String
    $supplierId: String
    $start: Date
    $end: Date
    $search: String
  ) {
    getPurchaseInvoices(
      taskId: $taskId
      departmentId: $departmentId
      employeeId: $employeeId
      projectId: $projectId
      resourseId: $resourseId
      supplierId: $supplierId
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
