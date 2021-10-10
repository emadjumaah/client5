import { gql } from "@apollo/client";

export default gql`
  mutation updateGeneralFinance(
    $_id: String
    $time: Date
    $branch: String
    $opType: Int
    $docNo: String
    $prefix: String
    $title: String
    $desc: String
    $amount: Float
    $items: String
    $customer: CustomerInput
    $employee: EmployeeInput
    $department: DepartmentInput
    $debitAcc: Int
    $creditAcc: Int
    $taskId: Int
    $userId: String
  ) {
    updateGeneralFinance(
      _id: $_id
      time: $time
      branch: $branch
      opType: $opType
      docNo: $docNo
      prefix: $prefix
      title: $title
      desc: $desc
      amount: $amount
      items: $items
      customer: $customer
      employee: $employee
      department: $department
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
