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
    $contract: ContractInput
    $debitAcc: Int
    $creditAcc: Int
    $refNo: String
    $chequeBank: String
    $chequeNo: String
    $chequeDate: String
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
      contract: $contract
      debitAcc: $debitAcc
      creditAcc: $creditAcc
      refNo: $refNo
      chequeBank: $chequeBank
      chequeNo: $chequeNo
      chequeDate: $chequeDate
      userId: $userId
    ) {
      ok
      message
      data
      error
    }
  }
`;
