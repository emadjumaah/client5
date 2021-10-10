import { gql } from "@apollo/client";
export default gql`
  query getInvoices(
    $start: Date
    $end: Date
    $search: String
    $taskId: Int
    $customerId: String
    $departmentId: String
    $employeeId: String
  ) {
    getInvoices(
      start: $start
      end: $end
      search: $search
      taskId: $taskId
      customerId: $customerId
      departmentId: $departmentId
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
        taskId

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
