import { gql } from '@apollo/client';

export default gql`
  mutation createExpenses(
    $time: Date
    $branch: String
    $docNo: String
    $prefix: String
    $title: String
    $items: String
    $desc: String
    $amount: Float
    $customer: CustomerInput
    $department: DepartmentInput
    $employee: EmployeeInput
    $project: ProjectInput
    $resourse: ResourseInput
    $debitAcc: Int
    $creditAcc: Int
    $taskId: Int
    $userId: String
  ) {
    createExpenses(
      time: $time
      branch: $branch
      docNo: $docNo
      prefix: $prefix
      title: $title
      desc: $desc
      items: $items
      amount: $amount
      customer: $customer
      department: $department
      employee: $employee
      project: $project
      resourse: $resourse
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
