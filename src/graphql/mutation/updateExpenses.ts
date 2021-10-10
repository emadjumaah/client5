import { gql } from "@apollo/client";

export default gql`
  mutation updateExpenses(
    $_id: String
    $time: Date
    $branch: String
    $docNo: String
    $prefix: String
    $title: String
    $desc: String
    $amount: Float
    $customer: CustomerInput
    $department: DepartmentInput
    $employee: EmployeeInput
    $debitAcc: Int
    $creditAcc: Int
    $taskId: Int
    $userId: String
  ) {
    updateExpenses(
      _id: $_id
      time: $time
      branch: $branch
      docNo: $docNo
      prefix: $prefix
      title: $title
      desc: $desc
      amount: $amount
      customer: $customer
      department: $department
      employee: $employee
      debitAcc: $debitAcc
      creditAcc: $creditAcc
      taskId: $taskId
      userId: $userId
    ) {
      ok
      message
      data
      error
    }
  }
`;
