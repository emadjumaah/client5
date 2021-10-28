import { gql } from '@apollo/client';

export default gql`
  mutation updateFinance(
    $_id: String
    $time: Date
    $branch: String
    $opType: Int
    $docNo: String
    $prefix: String
    $title: String
    $desc: String
    $amount: Float
    $customer: CustomerInput
    $employee: EmployeeInput
    $department: DepartmentInput
    $project: ProjectInput
    $resourse: ResourseInput
    $debitAcc: Int
    $creditAcc: Int
    $taskId: Int
    $refNo: String
    $userId: String
  ) {
    updateFinance(
      _id: $_id
      time: $time
      branch: $branch
      opType: $opType
      docNo: $docNo
      prefix: $prefix
      title: $title
      desc: $desc
      amount: $amount
      customer: $customer
      employee: $employee
      department: $department
      project: $project
      resourse: $resourse
      debitAcc: $debitAcc
      creditAcc: $creditAcc
      taskId: $taskId
      refNo: $refNo
      userId: $userId
    ) {
      ok
      message
      data
      error
    }
  }
`;
