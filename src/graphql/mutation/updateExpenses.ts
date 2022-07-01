import { gql } from '@apollo/client';

export default gql`
  mutation updateExpenses(
    $_id: String
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
    $contract: ContractInput
    $debitAcc: Int
    $creditAcc: Int
    $chequeBank: String
    $chequeNo: String
    $chequeDate: String
    $userId: String
    $opType: Int
  ) {
    updateExpenses(
      _id: $_id
      time: $time
      branch: $branch
      docNo: $docNo
      prefix: $prefix
      title: $title
      items: $items
      desc: $desc
      amount: $amount
      customer: $customer
      department: $department
      employee: $employee
      project: $project
      resourse: $resourse
      contract: $contract
      debitAcc: $debitAcc
      creditAcc: $creditAcc
      chequeBank: $chequeBank
      chequeNo: $chequeNo
      chequeDate: $chequeDate
      userId: $userId
      opType: $opType
    ) {
      ok
      message
      data
      error
    }
  }
`;
