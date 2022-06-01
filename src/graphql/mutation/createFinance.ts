import { gql } from '@apollo/client';

export default gql`
  mutation createFinance(
    $time: Date
    $branch: String
    $opType: Int
    $docNo: String
    $prefix: String
    $title: String
    $desc: String
    $amount: Float
    $customer: CustomerInput
    $supplier: SupplierInput
    $employee: EmployeeInput
    $department: DepartmentInput
    $project: ProjectInput
    $resourse: ResourseInput
    $debitAcc: Int
    $creditAcc: Int
    $taskId: Int
    $refNo: String
    $chequeBank: String
    $chequeNo: String
    $chequeDate: String
    $userId: String
  ) {
    createFinance(
      time: $time
      branch: $branch
      opType: $opType
      docNo: $docNo
      prefix: $prefix
      title: $title
      desc: $desc
      amount: $amount
      customer: $customer
      supplier: $supplier
      employee: $employee
      department: $department
      project: $project
      resourse: $resourse
      debitAcc: $debitAcc
      creditAcc: $creditAcc
      refNo: $refNo
      taskId: $taskId
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
