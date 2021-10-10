import { gql } from "@apollo/client";

export default gql`
  query getExpenses(
    $start: Date
    $end: Date
    $search: String
    $taskId: Int
    $customerId: String
    $departmentId: String
    $employeeId: String
  ) {
    getExpenses(
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

        employeeId
        employeeName
        employeeNameAr
        employeePhone

        departmentId
        departmentName
        departmentNameAr
        departmentColor

        refNo
        refType

        amount

        debitAcc
        debitAccName
        debitAccNameAr
        creditAcc
        creditAccName
        creditAccNameAr

        userId
        note

        createdAt
        updatedAt
      }
    }
  }
`;
